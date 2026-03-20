import type { VercelRequest, VercelResponse } from "@vercel/node";
import { validateInitData, extractUser } from "../../lib/telegram.js";
import {
  getOrCreateUserData,
  updateWorkout,
  deleteWorkout,
  getSetsForWorkout,
} from "../../lib/storage.js";

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

  const workoutId = req.query.id as string;
  if (!workoutId) return res.status(400).json({ error: "Missing workout id" });

  // Ensure user record exists
  await getOrCreateUserData(user.id, user.first_name, user.username);

  if (req.method === "GET") {
    const sets = await getSetsForWorkout(user.id, workoutId);
    return res.status(200).json(sets);
  }

  if (req.method === "PATCH") {
    const body = req.body;
    const updated = await updateWorkout(user.id, workoutId, {
      completed: body.completed,
      duration: body.duration,
      notes: body.notes,
      schedule: body.schedule,
    });
    if (!updated) return res.status(404).json({ error: "Workout not found" });
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    await deleteWorkout(user.id, workoutId);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
