import type { VercelRequest, VercelResponse } from "@vercel/node";
import { validateInitData, extractUser } from "../lib/telegram.js";
import {
  getOrCreateUserData,
  getSettings,
  updateSettings,
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

  await getOrCreateUserData(user.id, user.first_name, user.username);

  if (req.method === "GET") {
    const settings = await getSettings(user.id);
    return res.status(200).json(settings);
  }

  if (req.method === "PATCH") {
    const body = req.body;
    const updated = await updateSettings(user.id, {
      currentSchedule: body.currentSchedule,
      currentWeekStart: body.currentWeekStart,
      bodyweight: body.bodyweight !== undefined ? Number(body.bodyweight) : undefined,
    });
    return res.status(200).json(updated);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
