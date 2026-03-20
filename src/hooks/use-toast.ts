import { useState, useEffect } from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

type ToastInput = Omit<Toast, "id">;

let globalToasts: Toast[] = [];
let globalListeners: Array<(toasts: Toast[]) => void> = [];

function notifyListeners() {
  globalListeners.forEach((l) => l([...globalToasts]));
}

export function toast(input: ToastInput) {
  const id = Math.random().toString(36).slice(2);
  const t: Toast = { id, duration: 4000, ...input };
  globalToasts = [...globalToasts, t];
  notifyListeners();

  setTimeout(() => {
    globalToasts = globalToasts.filter((x) => x.id !== id);
    notifyListeners();
  }, t.duration);

  return { id, dismiss: () => dismissToast(id) };
}

function dismissToast(id: string) {
  globalToasts = globalToasts.filter((t) => t.id !== id);
  notifyListeners();
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(globalToasts);

  useEffect(() => {
    const listener = (updated: Toast[]) => setToasts(updated);
    globalListeners.push(listener);
    return () => {
      globalListeners = globalListeners.filter((l) => l !== listener);
    };
  }, []);

  return {
    toast,
    toasts,
    dismiss: dismissToast,
  };
}
