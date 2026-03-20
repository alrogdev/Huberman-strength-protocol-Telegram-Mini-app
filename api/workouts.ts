import type { VercelRequest, VercelResponse } from "@vercel/node";
import { validateInitData, extractUser } from "../lib/telegram.js";
import {
  getOrCreateUserData,
  getWorkouts,
  createWorkout,
} from "../lib/storage.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-telegram-init-data");
  if (req.method === "OPTIONS") return res.status(200).end();

  const initData = req.headers["x-telegram-init-data"] as string;
  const botToken = process.env.TELEGRAM_BOT_TOKEN!;

  if (!initData || !validateInitData(initData, botToken)) {
    return res.status(401).json({ error: "Invalid Telegram auth" });
  }

  const user = extractUser(initData);
  if (!user) return res.status(401).json({ error: "No user" });

  // Ensure user record exists
  await getOrCreateUserData(user.id, user.first_name, user.username);

  if (req.method === "GET") {
    const workouts = await getWorkouts(user.id);
    return res.status(200).json(workouts);
  }

  if (req.method === "POST") {
    const body = req.body;
    if (!body || !body.date || body.dayNumber === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const workout = await createWorkout(user.id, {
      date: body.date,
      dayNumber: Number(body.dayNumber),
      dayLabel: body.dayLabel || "",
      schedule: body.schedule || "A",
      completed: body.completed ?? false,
      notes: body.notes ?? null,
      duration: body.duration ?? null,
    });

    return res.status(201).json(workout);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
