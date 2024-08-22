// src/lib/stores/rotaStore.ts
import { writable, get } from "svelte/store";
import type {
  User,
  Rota,
  EditableShift,
  RotaShift,
} from "$lib/types/rotaTypes";
import { db } from "$lib/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import {
  getStartOfWeek,
  formatDate,
  timestampToDate,
  dateToTimestamp,
  calculateTotalHours,
} from "$lib/utils/rotaUtils";

function createRotaStore() {
  const { subscribe, set, update } = writable({
    users: [] as User[],
    currentWeekStart: getStartOfWeek(new Date()),
    rota: null as Rota | null,
    shifts: [] as EditableShift[],
    isEditing: false,
  });

  return {
    subscribe,

    loadUsers: async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const users = usersSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as User)
      );
      update((state) => ({ ...state, users }));
    },

    loadRota: async (weekStart: Date) => {
      const rotaDoc = doc(db, "rotas", formatDate(weekStart));
      const rotaSnapshot = await getDoc(rotaDoc);
      let rota: Rota | null = null;
      let shifts: EditableShift[] = [];

      if (rotaSnapshot.exists()) {
        rota = { id: rotaSnapshot.id, ...rotaSnapshot.data() } as Rota;
        const shiftsQuery = query(
          collection(db, "rotaShifts"),
          where("rota_id", "==", formatDate(weekStart))
        );
        const shiftsSnapshot = await getDocs(shiftsQuery);
        shifts = shiftsSnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
              start_time: timestampToDate(doc.data().start_time),
              end_time: timestampToDate(doc.data().end_time),
            } as EditableShift)
        );
      }

      update((state) => ({
        ...state,
        currentWeekStart: weekStart,
        rota,
        shifts,
      }));
    },

    copyPreviousWeek: async () => {
      const store = get(rotaStore);
      const previousWeekStart = new Date(
        store.currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000
      );
      const previousRotaDoc = doc(db, "rotas", formatDate(previousWeekStart));
      const previousRotaSnapshot = await getDoc(previousRotaDoc);

      if (previousRotaSnapshot.exists()) {
        const previousRota = previousRotaSnapshot.data() as Rota;
        const previousShiftsQuery = query(
          collection(db, "rotaShifts"),
          where("rota_id", "==", formatDate(previousWeekStart))
        );
        const previousShiftsSnapshot = await getDocs(previousShiftsQuery);

        const newShifts: EditableShift[] = previousShiftsSnapshot.docs.map(
          (doc) => {
            const shift = doc.data() as RotaShift;
            return {
              ...shift,
              rota_id: formatDate(store.currentWeekStart),
              start_time: timestampToDate(shift.start_time),
              end_time: timestampToDate(shift.end_time),
            };
          }
        );

        update((state) => ({
          ...state,
          rota: {
            ...previousRota,
            id: formatDate(state.currentWeekStart),
            week_start_date: dateToTimestamp(state.currentWeekStart),
            week_end_date: dateToTimestamp(
              new Date(
                state.currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000
              )
            ),
          },
          shifts: newShifts,
        }));
      }
    },

    createRota: async (weekStart: Date) => {
      const newRotaDoc = doc(db, "rotas", formatDate(weekStart));
      const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
      const newRota: Rota = {
        id: newRotaDoc.id,
        week_start_date: dateToTimestamp(weekStart),
        week_end_date: dateToTimestamp(weekEnd),
        total_hours: {},
      };
      await setDoc(newRotaDoc, newRota);
      update((state) => ({ ...state, rota: newRota, shifts: [] }));
    },

    updateShifts: (newShifts: EditableShift[]) => {
      update((state) => ({ ...state, shifts: newShifts || [] }));
    },

    saveRota: async (submittedShifts: EditableShift[]) => {
      const state = get(rotaStore);
      if (!state.rota) return;

      const batch = writeBatch(db);
      const rotaRef = doc(db, "rotas", state.rota.id);
      const totalHours: Record<string, number> = {};

      try {
        // Delete all existing shifts for this rota
        const deleteShiftsQuery = query(
          collection(db, "rotaShifts"),
          where("rota_id", "==", state.rota.id)
        );
        const querySnapshot = await getDocs(deleteShiftsQuery);
        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });

        // Add new shifts from submitted data
        submittedShifts.forEach((shift) => {
          const newShiftRef = doc(collection(db, "rotaShifts"));
          const newShift: RotaShift = {
            id: newShiftRef.id,
            rota_id: state.rota!.id,
            user_id: shift.user_id,
            day: shift.day,
            start_time: dateToTimestamp(shift.start_time),
            end_time: dateToTimestamp(shift.end_time),
          };
          batch.set(newShiftRef, newShift);

          // Calculate total hours for each user
          const userHours = calculateTotalHours([shift]);
          totalHours[shift.user_id] =
            (totalHours[shift.user_id] || 0) + userHours;
        });

        // Update rota with new total hours
        batch.update(rotaRef, { total_hours: totalHours });

        // Commit the batch
        await batch.commit();

        console.log("Rota saved successfully");

        // Update the store after successful save
        update((state) => ({
          ...state,
          rota: { ...state.rota!, total_hours: totalHours },
          shifts: submittedShifts,
          isEditing: false,
        }));
      } catch (error) {
        console.error("Error saving rota:", error);
        // Optionally, you can update the store to reflect the error state
        // update(state => ({ ...state, error: "Failed to save rota" }));
      }
    },
    setEditing: (isEditing: boolean) => {
      update((state) => ({ ...state, isEditing }));
    },
  };
}

export const rotaStore = createRotaStore();
