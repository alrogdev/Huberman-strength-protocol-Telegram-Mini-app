import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { protocolDays, getTypeBg, getTypeColor, getEquipmentLabel, getEquipmentColor } from "@/lib/protocol";
import { useTelegram } from "@/lib/telegram";
import type { WorkoutLog, SetLog, UserSettings } from "@/lib/types";
import {
  ArrowLeft, CheckCircle2, Plus, Trash2,
  Dumbbell, HeartPulse, Flame, Footprints, Zap, Thermometer,
  Play
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

interface LocalSet {
  tempId: string;
  exerciseName: string;
  muscleGroup: string;
  position: string;
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
  savedId?: string;
}

export default function WorkoutPage() {
  const params = useParams<{ dayNumber: string; date: string }>();
  const [, navigate] = useLocation();
  const { tg, isInTelegram } = useTelegram();

  const dayNumber = parseInt(params.dayNumber || "1");
  const dateStr = params.date || new Date().toISOString().split("T")[0];
  const protocolDay = protocolDays.find((d) => d.dayNumber === dayNumber);

  const { data: settings } = useQuery<UserSettings>({
    queryKey: ["/api/settings"],
  });

  const { data: workouts } = useQuery<WorkoutLog[]>({
    queryKey: ["/api/workouts"],
  });

  const existingWorkout = workouts?.find(
    (w) => w.date === dateStr && w.dayNumber === dayNumber
  );

  const { data: existingSets } = useQuery<SetLog[]>({
    queryKey: ["/api/workouts", existingWorkout?.id, "sets"],
    queryFn: async () => {
      if (!existingWorkout?.id) return [];
      const res = await fetch(`/api/workouts/${existingWorkout.id}`, {
        headers: { "x-telegram-init-data": window.Telegram?.WebApp?.initData ?? "" },
      });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!existingWorkout?.id,
  });

  const currentSchedule = settings?.currentSchedule || "A";
  const scheduleInfo = currentSchedule === "A" ? protocolDay?.scheduleA : protocolDay?.scheduleB;

  const [localSets, setLocalSets] = useState<LocalSet[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Set up Telegram BackButton
  useEffect(() => {
    if (!tg || !isInTelegram) return;
    tg.BackButton.show();
    const handler = () => navigate("/");
    tg.BackButton.onClick(handler);
    return () => {
      tg.BackButton.offClick(handler);
      tg.BackButton.hide();
    };
  }, [tg, isInTelegram, navigate]);

  const initializeSets = () => {
    if (!protocolDay) return;
    const sets: LocalSet[] = [];
    const resistanceExercises = protocolDay.exercises.filter((e) => e.position !== "cardio");
    const numSets = currentSchedule === "A" ? 3 : 2;

    resistanceExercises.forEach((exercise) => {
      for (let s = 1; s <= numSets; s++) {
        sets.push({
          tempId: `${exercise.name}-${s}-${Math.random().toString(36).slice(2, 8)}`,
          exerciseName: exercise.name,
          muscleGroup: exercise.muscleGroup,
          position: exercise.position,
          setNumber: s,
          reps: currentSchedule === "A" ? 6 : 10,
          weight: 0,
          completed: false,
        });
      }
    });

    setLocalSets(sets);
    setIsStarted(true);
    setStartTime(Date.now());
  };

  const loadExistingSets = () => {
    if (existingSets && existingSets.length > 0) {
      setLocalSets(
        existingSets.map((s) => ({
          tempId: s.id,
          exerciseName: s.exerciseName,
          muscleGroup: s.muscleGroup,
          position: s.position,
          setNumber: s.setNumber,
          reps: s.reps,
          weight: s.weight,
          completed: s.completed,
          savedId: s.id,
        }))
      );
      setIsStarted(true);
      setStartTime(Date.now());
    } else {
      initializeSets();
    }
  };

  const updateLocalSet = (tempId: string, field: keyof LocalSet, value: unknown) => {
    setLocalSets((prev) =>
      prev.map((s) => (s.tempId === tempId ? { ...s, [field]: value } : s))
    );
  };

  const addSet = (exerciseName: string, muscleGroup: string, position: string) => {
    const existingForExercise = localSets.filter((s) => s.exerciseName === exerciseName);
    const nextSetNumber = existingForExercise.length + 1;
    setLocalSets((prev) => [
      ...prev,
      {
        tempId: `${exerciseName}-${nextSetNumber}-${Math.random().toString(36).slice(2, 8)}`,
        exerciseName,
        muscleGroup,
        position,
        setNumber: nextSetNumber,
        reps: currentSchedule === "A" ? 6 : 10,
        weight: existingForExercise.length > 0 ? existingForExercise[existingForExercise.length - 1].weight : 0,
        completed: false,
      },
    ]);
  };

  const removeSet = (tempId: string) => {
    setLocalSets((prev) => prev.filter((s) => s.tempId !== tempId));
  };

  const createWorkoutMutation = useMutation({
    mutationFn: async () => {
      const duration = startTime ? Math.round((Date.now() - startTime) / 60000) : 0;
      const completedSets = localSets.filter((s) => s.completed);

      let workoutId: string;
      if (existingWorkout) {
        await apiRequest("PATCH", `/api/workouts/${existingWorkout.id}`, {
          completed: true,
          duration,
        });
        workoutId = existingWorkout.id;
      } else {
        const res = await apiRequest("POST", "/api/workouts", {
          date: dateStr,
          dayNumber,
          dayLabel: protocolDay?.labelRu || "",
          schedule: currentSchedule,
          completed: true,
          duration,
        });
        const data = await res.json();
        workoutId = data.id;
      }

      for (const set of completedSets) {
        if (!set.savedId) {
          await apiRequest("POST", "/api/sets", {
            workoutLogId: workoutId,
            exerciseName: set.exerciseName,
            muscleGroup: set.muscleGroup,
            position: set.position,
            setNumber: set.setNumber,
            reps: set.reps,
            weight: set.weight,
            completed: true,
          });
        }
      }

      return workoutId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      toast({ title: "Тренировка сохранена", description: "Отличная работа!" });
      navigate("/");
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить тренировку",
        variant: "destructive",
      });
    },
  });

  const saveCardioDayMutation = useMutation({
    mutationFn: async () => {
      if (existingWorkout) {
        await apiRequest("PATCH", `/api/workouts/${existingWorkout.id}`, {
          completed: true,
          duration: protocolDay?.type === "recovery" ? 30 : 45,
        });
      } else {
        await apiRequest("POST", "/api/workouts", {
          date: dateStr,
          dayNumber,
          dayLabel: protocolDay?.labelRu || "",
          schedule: currentSchedule,
          completed: true,
          duration: protocolDay?.type === "recovery" ? 30 : 45,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      toast({ title: "Тренировка отмечена" });
      navigate("/");
    },
  });

  if (!protocolDay) return null;

  const IconComponent = iconMap[protocolDay.icon] || Dumbbell;
  const isResistanceDay = protocolDay.type === "resistance";

  const exerciseGroups = new Map<string, LocalSet[]>();
  localSets.forEach((s) => {
    const group = exerciseGroups.get(s.exerciseName) || [];
    group.push(s);
    exerciseGroups.set(s.exerciseName, group);
  });

  const displayDate = new Date(dateStr + "T12:00:00").toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-5" data-testid="workout-page">
      {/* Header */}
      <div className="flex items-center gap-3">
        {!isInTelegram && (
          <Link href="/">
            <Button variant="ghost" size="icon" className="shrink-0" data-testid="button-back">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-md flex items-center justify-center ${getTypeBg(protocolDay.type)}`}>
              <IconComponent className={`w-3.5 h-3.5 ${getTypeColor(protocolDay.type)}`} />
            </div>
            <h1 className="text-lg font-bold" data-testid="text-workout-title">
              День {dayNumber}: {protocolDay.labelRu}
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 capitalize">{displayDate}</p>
        </div>
        {isResistanceDay && (
          <Badge variant="secondary" className="text-[10px] font-mono shrink-0" data-testid="badge-schedule-detail">
            {currentSchedule === "A" ? "A: 4-8×3-4" : "B: 8-15×2-3"}
          </Badge>
        )}
      </div>

      {existingWorkout?.completed && (
        <Card className="p-3 bg-emerald-500/10 border-emerald-500/20">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Тренировка выполнена
            </span>
            {existingWorkout.duration && (
              <span className="text-xs text-muted-foreground ml-auto">
                {existingWorkout.duration} мин
              </span>
            )}
          </div>
        </Card>
      )}

      {/* Cardio / Recovery day */}
      {!isResistanceDay && (
        <div className="space-y-4">
          <Card className="p-4 space-y-3">
            <p className="text-sm">{protocolDay.descriptionRu}</p>
            <Separator />
            <div className="space-y-2">
              {protocolDay.exercises.map((ex, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-sm flex-1">{ex.name}</span>
                  {ex.notes && (
                    <span className="text-xs text-muted-foreground">{ex.notes}</span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {!existingWorkout?.completed && (
            <Button
              className="w-full"
              onClick={() => saveCardioDayMutation.mutate()}
              disabled={saveCardioDayMutation.isPending}
              data-testid="button-complete-cardio"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Отметить как выполнено
            </Button>
          )}
        </div>
      )}

      {/* Resistance day */}
      {isResistanceDay && (
        <div className="space-y-4">
          {scheduleInfo && (
            <Card className="p-3">
              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <div>
                  <p className="font-semibold">{scheduleInfo.reps}</p>
                  <p className="text-muted-foreground">повт.</p>
                </div>
                <div>
                  <p className="font-semibold">{scheduleInfo.sets}</p>
                  <p className="text-muted-foreground">подх.</p>
                </div>
                <div>
                  <p className="font-semibold">{scheduleInfo.rest}</p>
                  <p className="text-muted-foreground">отдых</p>
                </div>
              </div>
            </Card>
          )}

          {!isStarted && (
            <Button
              className="w-full"
              onClick={loadExistingSets}
              data-testid="button-start-workout"
            >
              <Play className="w-4 h-4 mr-2" />
              Начать тренировку
            </Button>
          )}

          {isStarted && (
            <div className="space-y-4">
              {Array.from(exerciseGroups.entries()).map(([exerciseName, sets]) => {
                const exercise = protocolDay.exercises.find((e) => e.name === exerciseName);
                const completedCount = sets.filter((s) => s.completed).length;

                return (
                  <Card key={exerciseName} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold">{exerciseName}</span>
                          {exercise?.equipment && getEquipmentLabel(exercise.equipment) && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getEquipmentColor(exercise.equipment)}`}>
                              {getEquipmentLabel(exercise.equipment)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {completedCount}/{sets.length} подходов
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => addSet(
                          exerciseName,
                          exercise?.muscleGroup || "",
                          exercise?.position || "compound"
                        )}
                        data-testid={`button-add-set-${exerciseName}`}
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Подход
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {sets.map((set) => (
                        <div key={set.tempId} className="flex items-center gap-2">
                          <Checkbox
                            checked={set.completed}
                            onCheckedChange={(checked) =>
                              updateLocalSet(set.tempId, "completed", !!checked)
                            }
                            data-testid={`checkbox-set-${set.tempId}`}
                          />
                          <span className="text-xs text-muted-foreground w-12 shrink-0">
                            Подх. {set.setNumber}
                          </span>
                          <div className="flex items-center gap-1 flex-1">
                            <Input
                              type="number"
                              value={set.reps}
                              onChange={(e) =>
                                updateLocalSet(set.tempId, "reps", parseInt(e.target.value) || 0)
                              }
                              className="h-7 text-xs text-center w-14"
                              min={0}
                              data-testid={`input-reps-${set.tempId}`}
                            />
                            <span className="text-xs text-muted-foreground">×</span>
                            <Input
                              type="number"
                              value={set.weight}
                              onChange={(e) =>
                                updateLocalSet(set.tempId, "weight", parseFloat(e.target.value) || 0)
                              }
                              className="h-7 text-xs text-center w-16"
                              min={0}
                              step={2.5}
                              data-testid={`input-weight-${set.tempId}`}
                            />
                            <span className="text-xs text-muted-foreground">кг</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => removeSet(set.tempId)}
                            data-testid={`button-remove-set-${set.tempId}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}

              <Button
                className="w-full"
                onClick={() => createWorkoutMutation.mutate()}
                disabled={createWorkoutMutation.isPending}
                data-testid="button-finish-workout"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Завершить тренировку
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
