import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { protocolDays, getTypeBg, getTypeColor } from "@/lib/protocol";
import { useTelegram } from "@/lib/telegram";
import type { WorkoutLog, UserSettings } from "@/lib/types";
import {
  Calendar, CheckCircle2, Circle, Dumbbell, HeartPulse, Flame,
  Footprints, Zap, Thermometer, Timer, TrendingUp
} from "lucide-react";
import { Link } from "wouter";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "heart-pulse": HeartPulse,
  "footprints": Footprints,
  "thermometer": Thermometer,
  "dumbbell": Dumbbell,
  "zap": Zap,
  "flame": Flame,
  "biceps-flexed": Dumbbell,
};

function getWeekDates(): string[] {
  const now = new Date();
  const day = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

export default function Dashboard() {
  const { user } = useTelegram();
  const weekDates = getWeekDates();

  const { data: workouts, isLoading: loadingWorkouts } = useQuery<WorkoutLog[]>({
    queryKey: ["/api/workouts"],
  });

  const { data: settings } = useQuery<UserSettings>({
    queryKey: ["/api/settings"],
  });

  const currentSchedule = settings?.currentSchedule || "A";

  const weekWorkouts = workouts?.filter((w) =>
    weekDates.includes(w.date)
  ) || [];

  const completedThisWeek = weekWorkouts.filter((w) => w.completed).length;
  const totalDays = 7;
  const progressPercent = Math.round((completedThisWeek / totalDays) * 100);

  const totalMinutes = weekWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
  const resistanceDays = weekWorkouts.filter(w => {
    const pd = protocolDays.find(p => p.dayNumber === w.dayNumber);
    return pd?.type === "resistance" && w.completed;
  }).length;

  const greeting = user?.first_name ? `Привет, ${user.first_name}!` : "Протокол Хубермана";

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      {/* Week progress header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight" data-testid="text-title">
              {greeting}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Расписание {currentSchedule === "A" ? "A — Сила (4-8 повт.)" : "B — Гипертрофия (8-15 повт.)"}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs font-mono" data-testid="badge-schedule">
            Месяц {currentSchedule}
          </Badge>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 space-y-1" data-testid="card-stat-progress">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-xs">За неделю</span>
          </div>
          <p className="text-lg font-bold">{completedThisWeek}/{totalDays}</p>
          <Progress value={progressPercent} className="h-1.5" />
        </Card>
        <Card className="p-3 space-y-1" data-testid="card-stat-time">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Timer className="w-3.5 h-3.5" />
            <span className="text-xs">Время</span>
          </div>
          <p className="text-lg font-bold">{totalMinutes}<span className="text-sm font-normal text-muted-foreground"> мин</span></p>
        </Card>
        <Card className="p-3 space-y-1" data-testid="card-stat-resistance">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Dumbbell className="w-3.5 h-3.5" />
            <span className="text-xs">Силовые</span>
          </div>
          <p className="text-lg font-bold">{resistanceDays}/3</p>
        </Card>
      </div>

      {/* Weekly plan */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Неделя
        </h2>

        {loadingWorkouts ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {protocolDays.map((day, idx) => {
              const dateStr = weekDates[idx];
              const workoutForDay = weekWorkouts.find(
                (w) => w.date === dateStr && w.dayNumber === day.dayNumber
              );
              const isCompleted = workoutForDay?.completed;
              const isToday = dateStr === new Date().toISOString().split("T")[0];
              const IconComponent = iconMap[day.icon] || Dumbbell;

              return (
                <Link key={day.dayNumber} href={`/workout/${day.dayNumber}/${dateStr}`}>
                  <Card
                    className={`p-3 cursor-pointer transition-colors hover:bg-accent/50 ${
                      isToday ? "ring-1 ring-primary/30" : ""
                    } ${isCompleted ? "opacity-70" : ""}`}
                    data-testid={`card-day-${day.dayNumber}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${getTypeBg(day.type)}`}>
                        <IconComponent className={`w-4 h-4 ${getTypeColor(day.type)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold truncate">{day.labelRu}</span>
                          {isToday && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium">
                              Сегодня
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{day.descriptionRu}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground">{formatDate(dateStr)}</span>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground/30" />
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Periodization info */}
      <Card className="p-4 space-y-3" data-testid="card-periodization">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Периодизация</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded-lg ${currentSchedule === "A" ? "bg-primary/10 ring-1 ring-primary/20" : "bg-muted/50"}`}>
            <p className="text-xs font-bold mb-1">Расписание A — Сила</p>
            <p className="text-xs text-muted-foreground">4-8 повт., 3-4 подх.</p>
            <p className="text-xs text-muted-foreground">Отдых 2-4 мин</p>
          </div>
          <div className={`p-3 rounded-lg ${currentSchedule === "B" ? "bg-primary/10 ring-1 ring-primary/20" : "bg-muted/50"}`}>
            <p className="text-xs font-bold mb-1">Расписание B — Гипертрофия</p>
            <p className="text-xs text-muted-foreground">8-15 повт., 2-3 подх.</p>
            <p className="text-xs text-muted-foreground">Отдых ~90 сек</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
