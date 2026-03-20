import type { VercelRequest, VercelResponse } from "@vercel/node";
import { validateInitData, extractUser } from "../../lib/telegram.js";
import {
  getUserData,
  saveUserData,
  getOrCreateUserData,
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

  const requestedId = Number(req.query.telegramId);

  // Only allow users to access their own data
  if (requestedId !== user.id) {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (req.method === "GET") {
    const data = await getOrCreateUserData(user.id, user.first_name, user.username);
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    // Save full user data blob (only allowed for the authenticated user)
    const body = req.body;
    if (!body || body.telegramId !== user.id) {
      return res.status(400).json({ error: "Invalid data" });
    }
    await saveUserData(body);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
