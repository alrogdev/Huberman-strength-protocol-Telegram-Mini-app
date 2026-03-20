import type { VercelRequest, VercelResponse } from "@vercel/node";
import { validateInitData, extractUser } from "../lib/telegram.js";
import { getOrCreateUserData, createSet } from "../lib/storage.js";

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

  await getOrCreateUserData(user.id, user.first_name, user.username);

  if (req.method === "POST") {
    const body = req.body;
    if (!body || !body.workoutLogId || !body.exerciseName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const set = await createSet(user.id, {
      workoutLogId: body.workoutLogId,
      exerciseName: body.exerciseName,
      muscleGroup: body.muscleGroup || "",
      position: body.position || "compound",
      setNumber: Number(body.setNumber) || 1,
      reps: Number(body.reps) || 0,
      weight: Number(body.weight) || 0,
      completed: body.completed ?? false,
    });

    return res.status(201).json(set);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
