// app/store/activitiesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ActivityUpdate = {
  id: number;
  description: string;
  createdAt: string;
  isCompleted: boolean;
};

export type ActivitiesState = {
  updates: ActivityUpdate[];
};

// Seed data (you can tweak or keep as-is)
const initialState: ActivitiesState = {
  updates: [
    {
      id: 1,
      description: "Breakfast – oatmeal with banana and milk.",
      createdAt: "2025-11-19T08:00:00.000Z",
      isCompleted: false,
    },
    {
      id: 2,
      description: "Playtime outside – 30 minutes at the park.",
      createdAt: "2025-11-19T09:30:00.000Z",
      isCompleted: false,
    },
  ],
};

const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    // Load activities from localStorage on first mount
    setActivitiesFromStorage(
      state,
      action: PayloadAction<ActivityUpdate[]>
    ) {
      state.updates = action.payload;
    },

    addUpdate(
      state,
      action: PayloadAction<{ description: string }>
    ) {
      // Safeguard (shouldn’t be needed, but just in case)
      if (!state.updates) {
        state.updates = [];
      }

      const nextId =
        state.updates.length === 0
          ? 1
          : Math.max(...state.updates.map((u) => u.id)) + 1;

      state.updates.unshift({
        id: nextId,
        description: action.payload.description,
        createdAt: new Date().toISOString(),
        isCompleted: false,
      });
    },

    toggleUpdateStatus(
      state,
      action: PayloadAction<{ id: number }>
    ) {
      const update = state.updates.find(
        (item) => item.id === action.payload.id
      );
      if (update) {
        update.isCompleted = !update.isCompleted;
      }
    },
  },
});

export const {
  setActivitiesFromStorage,
  addUpdate,
  toggleUpdateStatus,
} = activitiesSlice.actions;

export default activitiesSlice.reducer;
