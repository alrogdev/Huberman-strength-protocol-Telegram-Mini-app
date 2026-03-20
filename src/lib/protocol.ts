// Huberman Foundational Fitness Protocol — Full Data

export type DayType = "resistance" | "cardio" | "recovery";

export type Equipment = "barbell" | "dumbbell" | "machine" | "kettlebell" | "bodyweight" | "cable" | "other";

export interface Exercise {
  name: string;
  muscleGroup: string;
  position: "shortened" | "lengthened" | "compound" | "cardio";
  equipment?: Equipment;
  notes?: string;
}

export interface ProtocolDay {
  dayNumber: number;
  label: string;
  labelRu: string;
  type: DayType;
  description: string;
  descriptionRu: string;
  icon: string; // lucide icon name
  duration: string;
  exercises: Exercise[];
  scheduleA: { reps: string; sets: string; rest: string };
  scheduleB: { reps: string; sets: string; rest: string };
}

export const protocolDays: ProtocolDay[] = [
  {
    dayNumber: 1,
    label: "Long Endurance",
    labelRu: "Длительное кардио",
    type: "cardio",
    description: "Zone 2 cardio for 60-75 minutes",
    descriptionRu: "Зона 2 кардио, 60-75 минут. Бег, велосипед, плавание или гребля.",
    icon: "heart-pulse",
    duration: "60-75 мин",
    exercises: [
      { name: "Бег трусцой", muscleGroup: "Кардио", position: "cardio", notes: "Зона 2 — можно поддерживать разговор" },
      { name: "Гребля", muscleGroup: "Кардио", position: "cardio" },
      { name: "Велосипед", muscleGroup: "Кардио", position: "cardio" },
      { name: "Плавание", muscleGroup: "Кардио", position: "cardio" },
    ],
    scheduleA: { reps: "—", sets: "—", rest: "—" },
    scheduleB: { reps: "—", sets: "—", rest: "—" },
  },
  {
    dayNumber: 2,
    label: "Legs",
    labelRu: "Ноги",
    type: "resistance",
    description: "Quadriceps, hamstrings, calves",
    descriptionRu: "Квадрицепсы, бицепс бедра, икры. Тибиальные подъёмы.",
    icon: "footprints",
    duration: "50-60 мин",
    exercises: [
      { name: "Тибиальные подъёмы", muscleGroup: "Голень", position: "shortened", equipment: "bodyweight", notes: "3×6-10 до отказа" },
      { name: "Разгибание ног", muscleGroup: "Квадрицепс", position: "shortened", equipment: "machine" },
      { name: "Глубокие приседания / Гакк", muscleGroup: "Квадрицепс", position: "lengthened", equipment: "barbell" },
      { name: "Гоблет-приседания", muscleGroup: "Квадрицепс", position: "lengthened", equipment: "kettlebell", notes: "Гиря у груди, глубокий сед" },
      { name: "Сгибание ног", muscleGroup: "Бицепс бедра", position: "shortened", equipment: "machine" },
      { name: "GHR / Мёртвая тяга", muscleGroup: "Бицепс бедра", position: "lengthened", equipment: "barbell" },
      { name: "Мёртвая тяга с гирей", muscleGroup: "Бицепс бедра", position: "lengthened", equipment: "kettlebell", notes: "На одной ноге или на двух" },
      { name: "Свинг с гирей", muscleGroup: "Бицепс бедра", position: "compound", equipment: "kettlebell", notes: "Взрывное разгибание бёдер" },
      { name: "Подъём на носки сидя", muscleGroup: "Икры", position: "shortened", equipment: "machine" },
      { name: "Подъём на носки стоя", muscleGroup: "Икры", position: "lengthened", equipment: "machine" },
    ],
    scheduleA: { reps: "4-8", sets: "3-4", rest: "2-4 мин" },
    scheduleB: { reps: "8-15", sets: "2-3", rest: "~90 сек" },
  },
  {
    dayNumber: 3,
    label: "Recovery",
    labelRu: "Восстановление",
    type: "recovery",
    description: "Heat/cold exposure, deliberate rest",
    descriptionRu: "Сауна + холодное воздействие. NSDR протокол. Лёгкая прогулка по желанию.",
    icon: "thermometer",
    duration: "Свободно",
    exercises: [
      { name: "Сауна", muscleGroup: "Восстановление", position: "cardio", notes: "20-30 мин" },
      { name: "Холодное воздействие", muscleGroup: "Восстановление", position: "cardio", notes: "Не после силовой тренировки" },
      { name: "NSDR протокол", muscleGroup: "Восстановление", position: "cardio", notes: "10-30 мин" },
      { name: "Лёгкая прогулка", muscleGroup: "Кардио", position: "cardio", notes: "Опционально, зона 2" },
    ],
    scheduleA: { reps: "—", sets: "—", rest: "—" },
    scheduleB: { reps: "—", sets: "—", rest: "—" },
  },
  {
    dayNumber: 4,
    label: "Torso",
    labelRu: "Торс",
    type: "resistance",
    description: "Chest, back, shoulders, neck",
    descriptionRu: "Грудь, спина, плечи, шея. Суперсеты push-pull.",
    icon: "dumbbell",
    duration: "50-60 мин",
    exercises: [
      { name: "Кроссовер на блоке", muscleGroup: "Грудь", position: "shortened", equipment: "cable" },
      { name: "Жим гантелей на наклонной", muscleGroup: "Грудь", position: "lengthened", equipment: "dumbbell" },
      { name: "Жим гири лёжа", muscleGroup: "Грудь", position: "lengthened", equipment: "kettlebell", notes: "Одной рукой, стабилизация кора" },
      { name: "Тяга блока к поясу", muscleGroup: "Спина", position: "shortened", equipment: "cable" },
      { name: "Тяга гири в наклоне", muscleGroup: "Спина", position: "shortened", equipment: "kettlebell", notes: "Одной рукой, пауза в верхней точке" },
      { name: "Подтягивания", muscleGroup: "Спина", position: "lengthened", equipment: "bodyweight" },
      { name: "Махи в стороны", muscleGroup: "Плечи", position: "shortened", equipment: "dumbbell" },
      { name: "Жим гири над головой", muscleGroup: "Плечи", position: "lengthened", equipment: "kettlebell", notes: "Поочерёдно, из rack-позиции" },
      { name: "Турецкий подъём", muscleGroup: "Кор / Плечи", position: "compound", equipment: "kettlebell", notes: "Полная амплитуда, контроль" },
      { name: "Подъём головы с грузом (бок)", muscleGroup: "Шея", position: "shortened", equipment: "other" },
      { name: "Подъём головы с грузом (зад)", muscleGroup: "Шея", position: "lengthened", equipment: "other" },
    ],
    scheduleA: { reps: "4-8", sets: "3-4", rest: "2-4 мин" },
    scheduleB: { reps: "8-15", sets: "2-3", rest: "~90 сек" },
  },
  {
    dayNumber: 5,
    label: "Moderate Cardio",
    labelRu: "Среднее кардио",
    type: "cardio",
    description: "35 min at 75-80% effort",
    descriptionRu: "35 минут на 75-80% усилий. Бег, гребля, велосипед, скакалка.",
    icon: "zap",
    duration: "35 мин",
    exercises: [
      { name: "Бег", muscleGroup: "Кардио", position: "cardio", notes: "75-80% от макс. ЧСС" },
      { name: "Гребля", muscleGroup: "Кардио", position: "cardio" },
      { name: "Велосипед", muscleGroup: "Кардио", position: "cardio" },
      { name: "Скакалка", muscleGroup: "Кардио", position: "cardio" },
      { name: "Комплекс с гирей", muscleGroup: "Кардио", position: "cardio", equipment: "kettlebell", notes: "Свинг + рывок + жим, без отдыха" },
    ],
    scheduleA: { reps: "—", sets: "—", rest: "—" },
    scheduleB: { reps: "—", sets: "—", rest: "—" },
  },
  {
    dayNumber: 6,
    label: "HIIT",
    labelRu: "ВИИТ",
    type: "cardio",
    description: "Sprint intervals, max effort",
    descriptionRu: "20-60 сек спринт + 10 сек отдых × 8-12 раундов. Максимальное усилие.",
    icon: "flame",
    duration: "20-30 мин",
    exercises: [
      { name: "Спринт на дорожке", muscleGroup: "Кардио", position: "cardio", notes: "20-60 сек макс + 10 сек отдых" },
      { name: "Assault bike", muscleGroup: "Кардио", position: "cardio", notes: "8-12 раундов" },
      { name: "Гребной тренажёр", muscleGroup: "Кардио", position: "cardio" },
      { name: "Ski erg", muscleGroup: "Кардио", position: "cardio" },
      { name: "ВИИТ-свинги с гирей", muscleGroup: "Кардио", position: "cardio", equipment: "kettlebell", notes: "30 сек свинг + 15 сек отдых × 10-15" },
      { name: "Рывок гири", muscleGroup: "Кардио", position: "cardio", equipment: "kettlebell", notes: "По 30 сек каждой рукой × 8-10" },
    ],
    scheduleA: { reps: "—", sets: "—", rest: "—" },
    scheduleB: { reps: "—", sets: "—", rest: "—" },
  },
  {
    dayNumber: 7,
    label: "Arms + Calves + Neck",
    labelRu: "Руки, икры, шея",
    type: "resistance",
    description: "Biceps, triceps, calves, neck",
    descriptionRu: "Бицепс, трицепс, икры (повтор), шея (повтор).",
    icon: "biceps-flexed",
    duration: "50-60 мин",
    exercises: [
      { name: "Сгибание на скамье Скотта", muscleGroup: "Бицепс", position: "shortened", equipment: "barbell" },
      { name: "Сгибание на наклонной скамье", muscleGroup: "Бицепс", position: "lengthened", equipment: "dumbbell" },
      { name: "Сгибание с гирей снизу", muscleGroup: "Бицепс", position: "lengthened", equipment: "kettlebell", notes: "Дно вверх, контроль хвата" },
      { name: "Отжимания на брусьях", muscleGroup: "Трицепс", position: "compound", equipment: "bodyweight" },
      { name: "Кикбэки", muscleGroup: "Трицепс", position: "shortened", equipment: "dumbbell" },
      { name: "Разгибание над головой", muscleGroup: "Трицепс", position: "lengthened", equipment: "dumbbell" },
      { name: "Разгибание с гирей над головой", muscleGroup: "Трицепс", position: "lengthened", equipment: "kettlebell", notes: "Двумя руками за дно гири" },
      { name: "Подъём на носки сидя", muscleGroup: "Икры", position: "shortened", equipment: "machine" },
      { name: "Подъём на носки стоя", muscleGroup: "Икры", position: "lengthened", equipment: "machine" },
      { name: "Подъём головы с грузом", muscleGroup: "Шея", position: "shortened", equipment: "other" },
    ],
    scheduleA: { reps: "4-8", sets: "3-4", rest: "2-4 мин" },
    scheduleB: { reps: "8-15", sets: "2-3", rest: "~90 сек" },
  },
];

export const dayNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
export const dayNamesFull = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

export function getTypeColor(type: DayType): string {
  switch (type) {
    case "resistance": return "text-orange-500";
    case "cardio": return "text-emerald-500";
    case "recovery": return "text-blue-400";
  }
}

export function getTypeBg(type: DayType): string {
  switch (type) {
    case "resistance": return "bg-orange-500/10";
    case "cardio": return "bg-emerald-500/10";
    case "recovery": return "bg-blue-400/10";
  }
}

export function getTypeBadge(type: DayType): string {
  switch (type) {
    case "resistance": return "Силовая";
    case "cardio": return "Кардио";
    case "recovery": return "Отдых";
  }
}

export function getEquipmentLabel(eq?: Equipment): string {
  if (!eq) return "";
  switch (eq) {
    case "kettlebell": return "Гиря";
    case "barbell": return "Штанга";
    case "dumbbell": return "Гантели";
    case "machine": return "Тренажёр";
    case "cable": return "Блок";
    case "bodyweight": return "Свой вес";
    case "other": return "";
  }
}

export function getEquipmentColor(eq?: Equipment): string {
  if (!eq) return "";
  switch (eq) {
    case "kettlebell": return "bg-amber-500/15 text-amber-600 dark:text-amber-400";
    case "barbell": return "bg-slate-500/15 text-slate-600 dark:text-slate-400";
    case "dumbbell": return "bg-violet-500/15 text-violet-600 dark:text-violet-400";
    case "machine": return "bg-sky-500/15 text-sky-600 dark:text-sky-400";
    case "cable": return "bg-sky-500/15 text-sky-600 dark:text-sky-400";
    case "bodyweight": return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400";
    case "other": return "";
  }
}
