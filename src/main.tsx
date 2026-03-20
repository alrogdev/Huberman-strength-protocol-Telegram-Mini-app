import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize Telegram WebApp
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

createRoot(document.getElementById("root")!).render(<App />);
