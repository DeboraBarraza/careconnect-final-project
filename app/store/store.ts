// app/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import activitiesReducer from "./activitiesSlice";
import tasksReducer from "./tasksSlice";

export const store = configureStore({
  reducer: {
    activities: activitiesReducer,
    tasks: tasksReducer,
  },
});

// Inferred types for Redux hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
