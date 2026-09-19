import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import axiosInstance from "../api/axiosInstance.ts";

const TIME_ZONE = "Europe/Chisinau";
const KEYS = {
  sessionId: "session_id",
  sessionDate: "current_date",
  gameStatus: "game_status",
  rowIndex: "row_index",
  guessList: "guess_list",
} as const;

export type GameStatus = "in_progress" | "win" | "lose";

export function todayInGameTimezone(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: TIME_ZONE });
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback; 
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
  }
}

export function useStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => readStorage(key, initialValue));
  const valueRef = useRef(value);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === "function" ? (next as (prev: T) => T)(valueRef.current) : next;
      valueRef.current = resolved;
      writeStorage(key, resolved);
      setValue(resolved);
    },
    [key]
  );

  return [value, set] as const;
}

export function useGameSession() {
  const [sessionId, setSessionId] = useStorage<string>(KEYS.sessionId, "");
  const [sessionDate, setSessionDate] = useStorage<string>(KEYS.sessionDate, "");
  const [gameStatus, setGameStatus] = useStorage<GameStatus>(KEYS.gameStatus, "in_progress");
  const [rowIndex, setRowIndex] = useStorage<number>(KEYS.rowIndex, 0);
  const [guessList, setGuessList] = useStorage<string[]>(KEYS.guessList, []);
  const requestedSession = useRef(false);

  useEffect(() => {
    
    if (sessionDate !== todayInGameTimezone()) {
      setSessionId("");
      setSessionDate(todayInGameTimezone());
      setGameStatus("in_progress");
      setRowIndex(0);
      setGuessList([]);
      return;
    }

    if (!sessionId && !requestedSession.current) {
      requestedSession.current = true;
      axiosInstance
        .get("/session/get-session/")
        .then(({ data }) => setSessionId(data.code))
        .catch(() => {
          requestedSession.current = false; 
        });
    }
  }, [
    sessionId,
    sessionDate,
    setSessionId,
    setSessionDate,
    setGameStatus,
    setRowIndex,
    setGuessList,
  ]);

  return {
    sessionId,
    sessionDate,
    gameStatus,
    rowIndex,
    guessList,
    setGameStatus,
    setRowIndex,
    setGuessList,
  };
}

export type ValidationResult =
  | { ok: true; data: unknown }
  | { ok: false; status?: number; message: string };

export async function validateSession(): Promise<ValidationResult> {
  try {
    const response = await axiosInstance.post("/session/validate-session/", {
      session_id: readStorage<string>(KEYS.sessionId, ""),
      current_date: readStorage<string>(KEYS.sessionDate, ""),
      game_status: readStorage<GameStatus>(KEYS.gameStatus, "in_progress"),
      row_index: readStorage<number>(KEYS.rowIndex, 0),
      guess_list: readStorage<string[]>(KEYS.guessList, []),
    });
    
    return { ok: true, data: response.data.statistic };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        ok: false,
        status: err.response?.status,
        message: err.response?.data?.message ?? "Request failed",
      };
    }
    return { ok: false, message: "Unexpected error" };
  }
}