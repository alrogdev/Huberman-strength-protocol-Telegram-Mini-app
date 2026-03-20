import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useTheme } from "@/lib/theme";
import { useTelegram } from "@/lib/telegram";
import type { UserSettings } from "@/lib/types";
import { Sun, Moon, RotateCw, Dumbbell, ExternalLink, User } from "lucide-react";

export default function SettingsPage() {
  const { theme, toggle } = useTheme();
  const { user, isInTelegram } = useTelegram();

  const { data: settings } = useQuery<UserSettings>({
    queryKey: ["/api/settings"],
  });

  const toggleScheduleMutation = useMutation({
    mutationFn: async () => {
      const newSchedule = settings?.currentSchedule === "A" ? "B" : "A";
      await apiRequest("PATCH", "/api/settings", {
        currentSchedule: newSchedule,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: "Расписание обновлено" });
    },
  });

  return (
    <div className="space-y-6" data-testid="settings-page">
      <div>
        <h1 className="text-xl font-bold tracking-tight" data-testid="text-settings-title">
          Настройки
        </h1>
      </div>

      {/* Telegram user info */}
      {isInTelegram && user && (
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold">Профиль Telegram</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary">
                {user.first_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">{user.first_name}</p>
              {user.username && (
                <p className="text-xs text-muted-foreground">@{user.username}</p>
              )}
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4 space-y-4">
        <h3 className="text-sm font-semibold">Периодизация</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm">Текущее расписание</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {settings?.currentSchedule === "A"
                ? "Сила: 4-8 повт., тяжёлые веса"
                : "Гипертрофия: 8-15 повт., умеренные веса"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleScheduleMutation.mutate()}
            disabled={toggleScheduleMutation.isPending}
            data-testid="button-toggle-schedule"
          >
            <RotateCw className="w-3.5 h-3.5 mr-1.5" />
            {settings?.currentSchedule === "A" ? "Перейти на B" : "Перейти на A"}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded-lg text-xs ${settings?.currentSchedule === "A" ? "bg-primary/10 ring-1 ring-primary/20" : "bg-muted/50"}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <Dumbbell className="w-3 h-3" />
              <span className="font-bold">A — Сила</span>
            </div>
            <p className="text-muted-foreground">4-8 повт., 3-4 подх.</p>
            <p className="text-muted-foreground">Отдых 2-4 мин</p>
          </div>
          <div className={`p-3 rounded-lg text-xs ${settings?.currentSchedule === "B" ? "bg-primary/10 ring-1 ring-primary/20" : "bg-muted/50"}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <Dumbbell className="w-3 h-3" />
              <span className="font-bold">B — Гипертрофия</span>
            </div>
            <p className="text-muted-foreground">8-15 повт., 2-3 подх.</p>
            <p className="text-muted-foreground">Отдых ~90 сек</p>
          </div>
        </div>
      </Card>

      {/* Theme toggle — only when not in Telegram (Telegram controls its own theme) */}
      {!isInTelegram && (
        <Card className="p-4 space-y-4">
          <h3 className="text-sm font-semibold">Внешний вид</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Тема</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {theme === "dark" ? "Тёмная тема" : "Светлая тема"}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={toggle} data-testid="button-toggle-theme">
              {theme === "dark" ? (
                <Sun className="w-3.5 h-3.5 mr-1.5" />
              ) : (
                <Moon className="w-3.5 h-3.5 mr-1.5" />
              )}
              {theme === "dark" ? "Светлая" : "Тёмная"}
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-4 space-y-3">
        <h3 className="text-sm font-semibold">Источник</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Этот трекер основан на Foundational Fitness Protocol доктора Эндрю Хубермана (Huberman Lab). Протокол охватывает силу, гипертрофию, выносливость и кардио-тренировки.
        </p>
        <a
          href="https://www.hubermanlab.com/newsletter/foundational-fitness-protocol"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          data-testid="link-huberman"
        >
          <ExternalLink className="w-3 h-3" />
          Huberman Lab — Foundational Fitness Protocol
        </a>
      </Card>
    </div>
  );
}
