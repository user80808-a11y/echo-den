export const getUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() } as UserProfile;
  }
  return null;
};
// --- User Profile Management ---
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture: string;
  subscriptionTier: string;
  createdAt?: any;
  lastLogin?: any;
}

export const createUserProfile = async (
  profile: UserProfile
): Promise<void> => {
  const userRef = doc(db, "users", profile.id);
  await setDoc(userRef, {
    ...profile,
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
  }, { merge: true });
};
// --- User Profile Management ---
export const updateUserProfile = async (
  userId: string,
  data: any
): Promise<void> => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, data, { merge: true });
};
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  deleteDoc,
  QueryDocumentSnapshot,
  DocumentData,
  orderBy,
  limit as limitFn,
  startAfter,
} from "firebase/firestore";
import { db } from "./firebase";

// --- Interfaces ---
export interface SleepSchedule {
  id?: string;
  userId: string;
  title: string;
  schedule: Array<{
    time: string;
    activity: string;
    description: string;
    category: "evening" | "night" | "morning";
  }>;
  questionnaireData: any;
  createdAt: any;
  updatedAt: any;
  isActive: boolean;
}

export interface SleepEntry {
  id?: string;
  userId: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  sleepQuality: number;
  mood: string;
  notes?: string;
  createdAt: any;
}

// --- Sleep Schedule Management ---
export const saveSleepSchedule = async (
  schedule: Omit<SleepSchedule, "id">
): Promise<string> => {
  const scheduleRef = await addDoc(collection(db, "sleepSchedules"), {
    ...schedule,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return scheduleRef.id;
};

export const getUserSleepSchedules = async (
  userId: string,
  pageSize: number = 10,
  lastDoc: QueryDocumentSnapshot<DocumentData> | null = null
): Promise<{ schedules: SleepSchedule[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> => {
  let q = query(
    collection(db, "sleepSchedules"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limitFn(pageSize)
  );
  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }
  const querySnapshot = await getDocs(q);
  const schedules: SleepSchedule[] = [];
  querySnapshot.forEach((doc) => {
    schedules.push({ id: doc.id, ...doc.data() } as SleepSchedule);
  });
  const lastVisible = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;
  return { schedules, lastDoc: lastVisible };
};

export const updateSleepSchedule = async (
  scheduleId: string,
  data: Partial<SleepSchedule>
): Promise<void> => {
  const scheduleRef = doc(db, "sleepSchedules", scheduleId);
  await updateDoc(scheduleRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const setActiveSchedule = async (
  userId: string,
  scheduleId: string
): Promise<void> => {
  const { schedules } = await getUserSleepSchedules(userId);
  const updatePromises = schedules.map((schedule) => {
    if (schedule.id) {
      return updateSleepSchedule(schedule.id, { isActive: false });
    }
    return Promise.resolve();
  });
  await Promise.all(updatePromises);
  await updateSleepSchedule(scheduleId, { isActive: true });
};

// --- Sleep Entry Management ---
export const saveSleepEntry = async (
  entry: Omit<SleepEntry, "id">
): Promise<string> => {
  const entryRef = await addDoc(collection(db, "sleepEntries"), {
    ...entry,
    createdAt: serverTimestamp(),
  });
  return entryRef.id;
};

export const getUserSleepEntries = async (
  userId: string,
  pageSize: number = 30,
  lastDoc: QueryDocumentSnapshot<DocumentData> | null = null
): Promise<{ entries: SleepEntry[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> => {
  let q = query(
    collection(db, "sleepEntries"),
    where("userId", "==", userId),
    orderBy("date", "desc"),
    limitFn(pageSize)
  );
  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }
  const querySnapshot = await getDocs(q);
  const entries: SleepEntry[] = [];
  querySnapshot.forEach((doc) => {
    entries.push({ id: doc.id, ...doc.data() } as SleepEntry);
  });
  const lastVisible = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;
  return { entries, lastDoc: lastVisible };
};

export const deleteSleepEntry = async (entryId: string): Promise<void> => {
  await deleteDoc(doc(db, "sleepEntries", entryId));
};

// --- Morning Routine Management ---
export const saveMorningRoutine = async (
  routine: Omit<any, "id"> & { userId: string }
): Promise<string> => {
  const routineRef = await addDoc(collection(db, "morningRoutines"), {
    ...routine,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return routineRef.id;
};

export const getUserMorningRoutines = async (
  userId: string,
  pageSize: number = 10,
  lastDoc: QueryDocumentSnapshot<DocumentData> | null = null
): Promise<{ routines: any[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> => {
  let q = query(
    collection(db, "morningRoutines"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limitFn(pageSize)
  );
  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }
  const querySnapshot = await getDocs(q);
  const routines: any[] = [];
  querySnapshot.forEach((doc) => {
    routines.push({ id: doc.id, ...doc.data() });
  });
  const lastVisible = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;
  return { routines, lastDoc: lastVisible };
};