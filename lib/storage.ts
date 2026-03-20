import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

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

export interface UserData {
  telegramId: number;
  firstName: string;
  username?: string;
  workoutLogs: WorkoutLog[];
  setLogs: SetLog[];
  settings: UserSettings;
}

const DEFAULT_SETTINGS: UserSettings = {
  currentSchedule: "A",
  currentWeekStart: null,
  bodyweight: null,
};

export async function getUserData(telegramId: number): Promise<UserData | null> {
  return await redis.get<UserData>(`user:${telegramId}`);
}

export async function saveUserData(data: UserData): Promise<void> {
  await redis.set(`user:${data.telegramId}`, data);
}

export async function getOrCreateUserData(
  telegramId: number,
  firstName: string,
  username?: string
): Promise<UserData> {
  const existing = await getUserData(telegramId);
  if (existing) {
    // Update name in case it changed
    existing.firstName = firstName;
    if (username !== undefined) existing.username = username;
    await saveUserData(existing);
    return existing;
  }

  const newUser: UserData = {
    telegramId,
    firstName,
    username,
    workoutLogs: [],
    setLogs: [],
    settings: { ...DEFAULT_SETTINGS },
  };
  await saveUserData(newUser);
  return newUser;
}

export async function getWorkouts(telegramId: number): Promise<WorkoutLog[]> {
  const data = await getUserData(telegramId);
  return data?.workoutLogs ?? [];
}

export async function createWorkout(
  telegramId: number,
  workout: Omit<WorkoutLog, "id">
): Promise<WorkoutLog> {
  const data = await getUserData(telegramId);
  if (!data) throw new Error("User not found");

  const newWorkout: WorkoutLog = {
    ...workout,
    id: crypto.randomUUID(),
  };
  data.workoutLogs.push(newWorkout);
  await saveUserData(data);
  return newWorkout;
}

export async function updateWorkout(
  telegramId: number,
  workoutId: string,
  updates: Partial<WorkoutLog>
): Promise<WorkoutLog | null> {
  const data = await getUserData(telegramId);
  if (!data) return null;

  const idx = data.workoutLogs.findIndex((w) => w.id === workoutId);
  if (idx === -1) return null;

  data.workoutLogs[idx] = { ...data.workoutLogs[idx], ...updates, id: workoutId };
  await saveUserData(data);
  return data.workoutLogs[idx];
}

export async function deleteWorkout(
  telegramId: number,
  workoutId: string
): Promise<void> {
  const data = await getUserData(telegramId);
  if (!data) return;

  data.workoutLogs = data.workoutLogs.filter((w) => w.id !== workoutId);
  // Also delete associated sets
  data.setLogs = data.setLogs.filter((s) => s.workoutLogId !== workoutId);
  await saveUserData(data);
}

export async function getSetsForWorkout(
  telegramId: number,
  workoutId: string
): Promise<SetLog[]> {
  const data = await getUserData(telegramId);
  return (data?.setLogs ?? []).filter((s) => s.workoutLogId === workoutId);
}

export async function createSet(
  telegramId: number,
  set: Omit<SetLog, "id">
): Promise<SetLog> {
  const data = await getUserData(telegramId);
  if (!data) throw new Error("User not found");

  const newSet: SetLog = {
    ...set,
    id: crypto.randomUUID(),
  };
  data.setLogs.push(newSet);
  await saveUserData(data);
  return newSet;
}

export async function updateSet(
  telegramId: number,
  setId: string,
  updates: Partial<SetLog>
): Promise<SetLog | null> {
  const data = await getUserData(telegramId);
  if (!data) return null;

  const idx = data.setLogs.findIndex((s) => s.id === setId);
  if (idx === -1) return null;

  data.setLogs[idx] = { ...data.setLogs[idx], ...updates, id: setId };
  await saveUserData(data);
  return data.setLogs[idx];
}

export async function deleteSet(telegramId: number, setId: string): Promise<void> {
  const data = await getUserData(telegramId);
  if (!data) return;

  data.setLogs = data.setLogs.filter((s) => s.id !== setId);
  await saveUserData(data);
}

export async function getSettings(telegramId: number): Promise<UserSettings> {
  const data = await getUserData(telegramId);
  return data?.settings ?? { ...DEFAULT_SETTINGS };
}

export async function updateSettings(
  telegramId: number,
  updates: Partial<UserSettings>
): Promise<UserSettings> {
  const data = await getUserData(telegramId);
  if (!data) {
    return { ...DEFAULT_SETTINGS, ...updates };
  }

  data.settings = { ...data.settings, ...updates };
  await saveUserData(data);
  return data.settings;
}
