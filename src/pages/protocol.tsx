import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { protocolDays, getTypeBg, getTypeColor, getTypeBadge, getEquipmentLabel, getEquipmentColor } from "@/lib/protocol";
import {
  Dumbbell, HeartPulse, Flame, Footprints, Zap, Thermometer,
  Clock, RotateCw, Target, Wind, Snowflake, Moon
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "heart-pulse": HeartPulse,
  "footprints": Footprints,
  "thermometer": Thermometer,
  "dumbbell": Dumbbell,
  "zap": Zap,
  "flame": Flame,
  "biceps-flexed": Dumbbell,
};

export default function ProtocolPage() {
  return (
    <div className="space-y-6" data-testid="protocol-page">
      <div>
        <h1 className="text-xl font-bold tracking-tight" data-testid="text-protocol-title">
          Протокол Хубермана
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Базовый фитнес-протокол: сила, гипертрофия, выносливость
        </p>
      </div>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="w-full grid grid-cols-3" data-testid="tabs-protocol">
          <TabsTrigger value="schedule" className="text-xs">Расписание</TabsTrigger>
          <TabsTrigger value="principles" className="text-xs">Принципы</TabsTrigger>
          <TabsTrigger value="recovery" className="text-xs">Восстановление</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-3 mt-4">
          {protocolDays.map((day) => {
            const IconComponent = iconMap[day.icon] || Dumbbell;
            const resistanceExercises = day.exercises.filter(e => e.position !== "cardio");
            const cardioExercises = day.exercises.filter(e => e.position === "cardio");

            return (
              <Card key={day.dayNumber} className="p-4 space-y-3" data-testid={`card-protocol-day-${day.dayNumber}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${getTypeBg(day.type)}`}>
                    <IconComponent className={`w-4 h-4 ${getTypeColor(day.type)}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">День {day.dayNumber}</span>
                      <span className="text-sm font-semibold">{day.labelRu}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {getTypeBadge(day.type)}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />{day.duration}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">{day.descriptionRu}</p>

                {day.type === "resistance" && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded bg-muted/50">
                        <p className="font-semibold mb-1">Расписание A</p>
                        <p className="text-muted-foreground">{day.scheduleA.reps} повт. × {day.scheduleA.sets} подх.</p>
                        <p className="text-muted-foreground">Отдых: {day.scheduleA.rest}</p>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <p className="font-semibold mb-1">Расписание B</p>
                        <p className="text-muted-foreground">{day.scheduleB.reps} повт. × {day.scheduleB.sets} подх.</p>
                        <p className="text-muted-foreground">Отдых: {day.scheduleB.rest}</p>
                      </div>
                    </div>
                  </>
                )}

                {resistanceExercises.length > 0 && (
                  <div className="space-y-1">
                    {resistanceExercises.map((ex, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs py-0.5">
                        <Badge variant="outline" className="text-[10px] px-1 py-0 w-16 justify-center shrink-0">
                          {ex.position === "shortened" ? "Сокращ." : ex.position === "lengthened" ? "Растян." : "Комп."}
                        </Badge>
                        {ex.equipment && getEquipmentLabel(ex.equipment) && (
                          <span className={`text-[10px] px-1.5 py-0 rounded-full font-medium shrink-0 ${getEquipmentColor(ex.equipment)}`}>
                            {getEquipmentLabel(ex.equipment)}
                          </span>
                        )}
                        <span className="flex-1 truncate">{ex.name}</span>
                        <span className="text-muted-foreground shrink-0">{ex.muscleGroup}</span>
                      </div>
                    ))}
                  </div>
                )}

                {cardioExercises.length > 0 && day.type !== "resistance" && (
                  <div className="space-y-1">
                    {cardioExercises.map((ex, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs py-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {ex.equipment && getEquipmentLabel(ex.equipment) && (
                          <span className={`text-[10px] px-1.5 py-0 rounded-full font-medium shrink-0 ${getEquipmentColor(ex.equipment)}`}>
                            {getEquipmentLabel(ex.equipment)}
                          </span>
                        )}
                        <span className="flex-1">{ex.name}</span>
                        {ex.notes && <span className="text-muted-foreground text-[10px]">{ex.notes}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="principles" className="space-y-3 mt-4">
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold">Выбор упражнений</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Два упражнения на группу мышц: одно в укороченной позиции (мышца максимально сокращена в конце амплитуды), второе — в растянутой позиции (сопротивление при удлинении мышцы). Это обеспечивает стабильность, качество движений и снижает риск травм.
            </p>
          </Card>

          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold">Периодизация</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ежемесячное чередование расписаний A и B. Расписание A (сила): 4-8 повторений, тяжёлые веса, длинный отдых. Расписание B (гипертрофия): 8-15 повторений, умеренные веса, короткий отдых. Каждая мышечная группа тренируется дважды в неделю — один раз напрямую, один раз косвенно.
            </p>
          </Card>

          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold">Длительность тренировки</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              50-60 минут интенсивной работы после разминки, максимум 75 минут (включая отдых между подходами). Разомнитесь и работайте сосредоточенно — без текстовых сообщений между подходами.
            </p>
          </Card>

          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold">Дыхание</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Между подходами используйте физиологические вздохи: два полных вдоха через нос + один полный выдох через рот. После тренировки — 3-5 минут медленного дыхания для восстановления нервной системы.
            </p>
          </Card>

          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold">Кардио структура</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              3 кардио-дня: длительное зона 2 (60-75 мин), среднее (35 мин на 75-80%), ВИИТ (спринты 20-60 сек × 8-12 раундов). Формула макс ЧСС: 220 минус возраст.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="recovery" className="space-y-3 mt-4">
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Snowflake className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold">Холодное воздействие</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Не использовать ледяные ванны сразу после силовой тренировки — это притупляет адаптацию к силе и гипертрофии. Если в день силовой — подождите 6-8 часов или используйте до тренировки. Холодный душ, вероятно, не имеет такого эффекта.
            </p>
          </Card>

          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold">Гибкость</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Статические растяжки — лучший способ улучшить гибкость. Удерживайте каждую мышечную группу 30-60 секунд, минимум 3 раза в неделю. Длинные выдохи во время растяжки расслабляют мышцы и углубляют растяжку.
            </p>
          </Card>

          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold">При болезни</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Лёгкие симптомы: сократите длительность и интенсивность на 50%+. Серьёзная болезнь: полный пропуск, возврат за 3-7 дней. Плохой сон или стресс: пропустите тренировку или попробуйте NSDR протокол (10-30 мин).
            </p>
          </Card>

          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold">Адаптация расписания</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Конкретные дни не принципиальны — важен интервал между ними для восстановления. Если пропустили день — объедините тренировки позже. Можно менять местами дни 4 и 5. Начинайте неделю с любого удобного дня.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
