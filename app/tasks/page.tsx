// app/tasks/page.tsx
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import {
  addTask,
  toggleTaskStatus,
  setTasksFromStorage,
  fetchSuggestedTasks,
  TaskItem,
  SuggestedTask,
} from "../store/tasksSlice";

import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import {
  formatAbsoluteDateTime,
  formatRelativeTime,
} from "../utils/dateHelpers";

const TASKS_STORAGE_KEY = "careconnect_tasks_v1";

export default function TasksPage() {
  const dispatch = useDispatch();

  // Redux selectors
  const tasks = useSelector(
    (state: RootState) => state.tasks.items
  ) as TaskItem[];

  const suggestedTasks = useSelector(
    (state: RootState) => state.tasks.suggested
  ) as SuggestedTask[];

  const isLoadingSuggested = useSelector(
    (state: RootState) => state.tasks.isLoadingSuggested
  );
  const suggestedError = useSelector(
    (state: RootState) => state.tasks.suggestedError
  );

  // Local UI state
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Mark client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load tasks from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(TASKS_STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        dispatch(setTasksFromStorage(parsed));
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage:", error);
    }
  }, [dispatch]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (!isClient) return;
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(
        TASKS_STORAGE_KEY,
        JSON.stringify(tasks)
      );
    } catch (error) {
      console.error("Failed to save tasks to localStorage:", error);
    }
  }, [isClient, tasks]);

  // Fetch suggested tasks from API
  useEffect(() => {
    dispatch(fetchSuggestedTasks() as any);
  }, [dispatch]);

  const handleAddTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTaskDescription.trim()) return;

    try {
      setSubmitError(null);
      setIsSubmitting(true);

      dispatch(addTask({ description: newTaskDescription.trim() }));
      setNewTaskDescription("");
    } catch (error) {
      console.error(error);
      setSubmitError("Something went wrong while saving the task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTask = (id: number) => {
    dispatch(toggleTaskStatus({ id }));
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-semibold tracking-tight">
          Tasks &amp; Reminders
        </h1>

        {/* Suggested Tasks (API) */}
        <section className="mb-8 rounded-2xl bg-slate-900/80 p-5 shadow-lg shadow-black/40">
          <h2 className="mb-4 text-lg font-semibold text-emerald-300">
            Suggested Tasks (API)
          </h2>

          {isLoadingSuggested && <LoadingSpinner />}

          {suggestedError && !isLoadingSuggested && (
            <ErrorMessage message={suggestedError} />
          )}

          {!isLoadingSuggested && !suggestedError && (
            <div className="space-y-3">
              {suggestedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-xl bg-slate-900/90 px-4 py-3 text-sm"
                >
                  <p className="text-slate-100">{task.title}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                      task.completed
                        ? "bg-emerald-500/90 text-emerald-950"
                        : "bg-amber-400/90 text-amber-950"
                    }`}
                  >
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                </div>
              ))}

              {suggestedTasks.length === 0 && (
                <p className="text-sm text-slate-400">
                  No suggested tasks available right now.
                </p>
              )}
            </div>
          )}
        </section>

        {/* Today's Tasks */}
        <section className="mb-8 rounded-2xl bg-slate-900/80 p-5 shadow-lg shadow-black/40">
          <h2 className="mb-4 text-lg font-semibold text-emerald-300">
            Today&apos;s Tasks
          </h2>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-xl bg-slate-900/90 px-4 py-3"
              >
                {/* Top line: date + relative time + status pill */}
                <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                  <p>
                    {formatAbsoluteDateTime(task.createdAt)}
                    {isClient && (
                      <span suppressHydrationWarning>{` · ${formatRelativeTime(
                        task.createdAt
                      )}`}</span>
                    )}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleToggleTask(task.id)}
                    className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                      task.isCompleted
                        ? "bg-emerald-500/90 text-emerald-950"
                        : "bg-amber-400/90 text-amber-950"
                    }`}
                  >
                    {task.isCompleted ? "Completed" : "Pending"}
                  </button>
                </div>

                <p className="text-sm text-slate-100">
                  {task.description}
                </p>
              </div>
            ))}

            {tasks.length === 0 && (
              <p className="text-sm text-slate-400">
                No tasks yet. Add your first task below.
              </p>
            )}
          </div>
        </section>

        {/* Add New Task */}
        <section className="rounded-2xl bg-slate-900/80 p-5 shadow-lg shadow-black/40">
          <h2 className="mb-3 text-lg font-semibold text-emerald-300">
            Add New Task
          </h2>

          <form onSubmit={handleAddTask} className="space-y-3">
            <input
              type="text"
              value={newTaskDescription}
              onChange={(event) =>
                setNewTaskDescription(event.target.value)
              }
              placeholder="Task description..."
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none ring-emerald-500/60 focus:ring-2"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Saving...</span>
                </>
              ) : (
                "Save Task"
              )}
            </button>

            {submitError && (
              <ErrorMessage message={submitError} className="text-xs" />
            )}
          </form>
        </section>
      </div>
    </main>
  );
}
