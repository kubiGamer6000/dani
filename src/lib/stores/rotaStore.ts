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
  runTransaction,
} from "firebase/firestore";
import {
  getStartOfWeek,
  formatDate,
  timestampToDate,
  dateToTimestamp,
  calculateTotalHours,
} from "$lib/utils/rotaUtils";
import { is } from "date-fns/locale";

function createRotaStore() {
  const { subscribe, set, update } = writable({
    users: [] as User[],
    currentWeekStart: getStartOfWeek(new Date()),
    newWeekStart: getStartOfWeek(new Date()),
    rota: null as Rota | null,
    shifts: [] as EditableShift[],
    isEditing: false,
    isLoadingUsers: true,
    isLoadingRota: true,
    error: null as string | null,
  });

  return {
    subscribe,

    loadUsers: async () => {
      try {
        const staffQuery = query(
          collection(db, "users"),
          where("role", "==", "staff")
        );
        const usersSnapshot = await getDocs(staffQuery);
        const users = usersSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as User)
        );
        update((state) => ({ ...state, users, isLoadingUsers: false }));
      } catch (error) {
        console.error("Error loading users:", error);
        update((state) => ({
          ...state,
          isLoadingUsers: false,
          error: "Failed to load users",
        }));
      }
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
        isLoadingRota: false,
      }));
    },

    createRota: async (weekStart: Date) => {
      const rotaId = formatDate(weekStart);
      const existingRotaDoc = await getDoc(doc(db, "rotas", rotaId));

      if (existingRotaDoc.exists()) {
        console.error("Rota already exists for this week");
        return;
      }

      const newRotaDoc = doc(db, "rotas", rotaId);
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

      try {
        let totalHours: Record<string, number>;
        await runTransaction(db, async (transaction) => {
          const rotaRef = doc(db, "rotas", state.rota!.id);
          const rotaDoc = await transaction.get(rotaRef);

          if (!rotaDoc.exists()) {
            throw "Rota does not exist!";
          }

          // Delete existing shifts
          const deleteShiftsQuery = query(
            collection(db, "rotaShifts"),
            where("rota_id", "==", state.rota!.id)
          );
          const querySnapshot = await getDocs(deleteShiftsQuery);
          querySnapshot.forEach((doc) => {
            transaction.delete(doc.ref);
          });

          // Add new shifts and calculate total hours
          totalHours = {};
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
            transaction.set(newShiftRef, newShift);

            const userHours = calculateTotalHours([shift]);
            totalHours[shift.user_id] =
              (totalHours[shift.user_id] || 0) + userHours;
          });

          // Update rota with new total hours
          transaction.update(rotaRef, { total_hours: totalHours });
        });

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
        update((state) => ({ ...state, error: "Failed to save rota" }));
      }
    },
    setEditing: (isEditing: boolean) => {
      update((state) => ({ ...state, isEditing }));
    },
    changeWeek: (offset: number, currentWeekStart: Date) => {
      const newWeekStartDate = new Date(currentWeekStart);
      newWeekStartDate.setDate(newWeekStartDate.getDate() + offset * 7);

      update((state) => ({ ...state, newWeekStart: newWeekStartDate }));

      return newWeekStartDate;
    },
  };
}

export const rotaStore = createRotaStore();
