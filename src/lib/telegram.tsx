import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramContextValue {
  tg: TelegramWebApp | null;
  user: TelegramUser | null;
  initData: string;
  colorScheme: "light" | "dark";
  isInTelegram: boolean;
}

const TelegramContext = createContext<TelegramContextValue>({
  tg: null,
  user: null,
  initData: "",
  colorScheme: "dark",
  isInTelegram: false,
});

export function TelegramProvider({ children }: { children: ReactNode }) {
  const tg = window.Telegram?.WebApp ?? null;
  const isInTelegram = !!tg && !!tg.initData;

  const user: TelegramUser | null = tg?.initDataUnsafe?.user
    ? {
        id: tg.initDataUnsafe.user.id,
        first_name: tg.initDataUnsafe.user.first_name,
        last_name: tg.initDataUnsafe.user.last_name,
        username: tg.initDataUnsafe.user.username,
        language_code: tg.initDataUnsafe.user.language_code,
      }
    : null;

  const [colorScheme, setColorScheme] = useState<"light" | "dark">(
    tg?.colorScheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );

  useEffect(() => {
    if (!tg) return;
    const handler = () => {
      setColorScheme(tg.colorScheme);
    };
    tg.onEvent("themeChanged", handler);
    return () => {
      tg.offEvent("themeChanged", handler);
    };
  }, [tg]);

  return (
    <TelegramContext.Provider
      value={{
        tg,
        user,
        initData: tg?.initData ?? "",
        colorScheme,
        isInTelegram,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  return useContext(TelegramContext);
}
