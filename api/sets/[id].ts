import type { VercelRequest, VercelResponse } from "@vercel/node";
import { validateInitData, extractUser } from "../../lib/telegram.js";
import { getOrCreateUserData, updateSet, deleteSet } from "../../lib/storage.js";

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

  const setId = req.query.id as string;
  if (!setId) return res.status(400).json({ error: "Missing set id" });

  await getOrCreateUserData(user.id, user.first_name, user.username);

  if (req.method === "PATCH") {
    const body = req.body;
    const updated = await updateSet(user.id, setId, {
      reps: body.reps !== undefined ? Number(body.reps) : undefined,
      weight: body.weight !== undefined ? Number(body.weight) : undefined,
      completed: body.completed,
      setNumber: body.setNumber !== undefined ? Number(body.setNumber) : undefined,
    });
    if (!updated) return res.status(404).json({ error: "Set not found" });
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    await deleteSet(user.id, setId);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
