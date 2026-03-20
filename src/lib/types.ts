export interface WorkoutLog {
  id: string;
  date: string;
  dayNumber: number;
  dayLabel: string;
  schedule: string;
  completed: boolean;
  notes: string | null;
  duration: number | null;
}

export interface SetLog {
  id: string;
  workoutLogId: string;
  exerciseName: string;
  muscleGroup: string;
  position: string;
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface UserSettings {
  currentSchedule: string;
  currentWeekStart: string | null;
  bodyweight: number | null;
}
