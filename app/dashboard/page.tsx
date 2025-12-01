// app/dashboard/page.tsx
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import {
  addUpdate,
  toggleUpdateStatus,
  setActivitiesFromStorage,
} from "../store/activitiesSlice";

import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import {
  formatAbsoluteDateTime,
  formatRelativeTime,
} from "../utils/dateHelpers";

type WeatherState = {
  temperature: number | null;
  windSpeed: number | null;
  lastUpdated: string | null;
  isLoading: boolean;
  error: string | null;
};

const ACTIVITIES_STORAGE_KEY = "careconnect_activities_v1";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const updates = useSelector(
    (state: RootState) => state.activities.updates
  );

  const [newDescription, setNewDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [weather, setWeather] = useState<WeatherState>({
    temperature: null,
    windSpeed: null,
    lastUpdated: null,
    isLoading: false,
    error: null,
  });

  const [isClient, setIsClient] = useState(false);

  // Mark that we're on the client (for relative time + localStorage)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // ---- Load activities from localStorage on first mount ----
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(ACTIVITIES_STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        dispatch(setActivitiesFromStorage(parsed));
      }
    } catch (error) {
      console.error("Failed to load activities from localStorage:", error);
    }
  }, [dispatch]);

  // ---- Save activities to localStorage whenever they change ----
  useEffect(() => {
    if (!isClient) return;
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(
        ACTIVITIES_STORAGE_KEY,
        JSON.stringify(updates)
      );
    } catch (error) {
      console.error("Failed to save activities to localStorage:", error);
    }
  }, [isClient, updates]);

  // --- Weather fetching ---

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setWeather((prev) => ({ ...prev, isLoading: true, error: null }));

        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=33.5313&longitude=-117.7076&current=temperature_2m,wind_speed_10m&timezone=auto"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weather data.");
        }

        const data = await response.json();
        const current = data.current;
        const now = new Date().toISOString();

        setWeather({
          temperature: current?.temperature_2m ?? null,
          windSpeed: current?.wind_speed_10m ?? null,
          lastUpdated: now,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error(error);
        setWeather((prev) => ({
          ...prev,
          isLoading: false,
          error: "Unable to load weather right now.",
        }));
      }
    };

    fetchWeather();
  }, []);

  // --- Handlers ---

  const handleAddUpdate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newDescription.trim()) return;

    try {
      setSubmitError(null);
      setIsSubmitting(true);

      dispatch(addUpdate({ description: newDescription.trim() }));
      setNewDescription("");
    } catch (error) {
      console.error(error);
      setSubmitError("Something went wrong while saving the update.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = (id: number) => {
    dispatch(toggleUpdateStatus({ id }));
  };

  // --- Weather card rendering ---

  const renderWeatherContent = () => {
    if (weather.isLoading) {
      return <LoadingSpinner />;
    }

    if (weather.error) {
      return <ErrorMessage message={weather.error} />;
    }

    if (weather.temperature === null || weather.windSpeed === null) {
      return (
        <p className="text-sm text-slate-300">
          Weather information is not available right now.
        </p>
      );
    }

    return (
      <>
        <p className="text-sm">
          Temperature:{" "}
          <span className="font-semibold">{weather.temperature}°C</span>
        </p>
        <p className="text-sm">
          Wind speed:{" "}
          <span className="font-semibold">{weather.windSpeed} km/h</span>
        </p>
        {weather.lastUpdated && (
          <p className="mt-2 text-xs text-slate-400">
            Last updated: {formatAbsoluteDateTime(weather.lastUpdated)}
          </p>
        )}
      </>
    );
  };

  // --- JSX ---

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-semibold tracking-tight">
          Activity Feed
        </h1>

        {/* Weather card */}
        <section className="mb-8 rounded-2xl bg-slate-900/80 p-5 shadow-lg shadow-black/40">
          <h2 className="mb-2 text-lg font-semibold text-emerald-300">
            Today&apos;s Weather – Laguna Niguel Area
          </h2>
          {renderWeatherContent()}
        </section>

        {/* Updates list */}
        <section className="mb-8 rounded-2xl bg-slate-900/80 p-5 shadow-lg shadow-black/40">
          <h2 className="mb-4 text-lg font-semibold text-emerald-300">
            Today&apos;s Updates
          </h2>

          <div className="space-y-3">
            {updates.map((update) => (
              <div
                key={update.id}
                className="rounded-xl bg-slate-900/90 px-4 py-3"
              >
                {/* Top line: date + relative time + status pill */}
                <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                  <p>
                    {formatAbsoluteDateTime(update.createdAt)}
                    {isClient && (
                      <span suppressHydrationWarning>{` · ${formatRelativeTime(
                        update.createdAt
                      )}`}</span>
                    )}
                  </p>

                  {/* Status pill (Mark as Completed) */}
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(update.id)}
                    className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                      update.isCompleted
                        ? "bg-emerald-500/90 text-emerald-950"
                        : "bg-amber-400/90 text-amber-950"
                    }`}
                  >
                    {update.isCompleted ? "Completed" : "Pending"}
                  </button>
                </div>

                <p className="text-sm text-slate-100">
                  {update.description}
                </p>
              </div>
            ))}

            {updates.length === 0 && (
              <p className="text-sm text-slate-400">
                No updates yet. Add the first update below.
              </p>
            )}
          </div>
        </section>

        {/* Add new update */}
        <section className="rounded-2xl bg-slate-900/80 p-5 shadow-lg shadow-black/40">
          <h2 className="mb-3 text-lg font-semibold text-emerald-300">
            Add New Update
          </h2>

          <form onSubmit={handleAddUpdate} className="space-y-3">
            <input
              type="text"
              value={newDescription}
              onChange={(event) => setNewDescription(event.target.value)}
              placeholder="Update description..."
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
                "Save Update"
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
