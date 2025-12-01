// app/store/tasksSlice.ts
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";

export type TaskItem = {
  id: number;
  description: string;
  createdAt: string;
  isCompleted: boolean;
};

export type SuggestedTask = {
  id: number;
  title: string;
  description?: string;
  completed?: boolean;
};

export type TasksState = {
  items: TaskItem[];
  suggested: SuggestedTask[];
  isLoadingSuggested: boolean;
  suggestedError: string | null;
};

const initialState: TasksState = {
  items: [],
  suggested: [],
  isLoadingSuggested: false,
  suggestedError: null,
};

// Fetch suggested tasks from JSONPlaceholder
export const fetchSuggestedTasks = createAsyncThunk<
  SuggestedTask[]
>("tasks/fetchSuggestedTasks", async () => {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/todos?_limit=5"
  );
  const data = await response.json();

  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    completed: item.completed,
  }));
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // Load tasks from localStorage on first mount
    setTasksFromStorage(state, action: PayloadAction<TaskItem[]>) {
      state.items = action.payload;
    },

    addTask(state, action: PayloadAction<{ description: string }>) {
      const nextId =
        state.items.length === 0
          ? 1
          : Math.max(...state.items.map((t) => t.id)) + 1;

      state.items.unshift({
        id: nextId,
        description: action.payload.description,
        createdAt: new Date().toISOString(),
        isCompleted: false,
      });
    },

    toggleTaskStatus(state, action: PayloadAction<{ id: number }>) {
      const task = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (task) {
        task.isCompleted = !task.isCompleted;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuggestedTasks.pending, (state) => {
        state.isLoadingSuggested = true;
        state.suggestedError = null;
      })
      .addCase(
        fetchSuggestedTasks.fulfilled,
        (state, action: PayloadAction<SuggestedTask[]>) => {
          state.isLoadingSuggested = false;
          state.suggested = action.payload;
        }
      )
      .addCase(fetchSuggestedTasks.rejected, (state, action) => {
        state.isLoadingSuggested = false;
        state.suggestedError =
          action.error.message ?? "Failed to load suggested tasks.";
      });
  },
});

export const {
  setTasksFromStorage,
  addTask,
  toggleTaskStatus,
} = tasksSlice.actions;

export default tasksSlice.reducer;
