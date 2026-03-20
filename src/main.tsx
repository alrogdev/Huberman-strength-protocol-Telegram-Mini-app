import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Clean up Telegram hash params before hash-router kicks in.
// Telegram opens Mini Apps with #tgWebAppData=... in the URL,
// which wouter's useHashLocation interprets as a route → 404.
// We strip it and redirect to the root hash route.
const rawHash = window.location.hash;
if (rawHash && !rawHash.startsWith("#/") && rawHash !== "#") {
  // Preserve hash only if it looks like a wouter route (starts with #/)
  window.location.hash = "#/";
}

// Initialize Telegram WebApp
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

createRoot(document.getElementById("root")!).render(<App />);
