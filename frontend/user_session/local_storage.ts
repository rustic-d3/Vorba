import { useState, useEffect } from "react";

export function useStorage(key: string) {
  const [value, setValue] = useState(() => {
    const savedValue = localStorage.getItem(key);
    return savedValue || "";
  });
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);
  return [value, setValue] as const;
}

export function validSession(inputDate: string | number | Date): boolean {
  const dateToCheck = new Date(inputDate);

  if (isNaN(dateToCheck.getTime())) {
    return false;
  }

  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Europe/Chisinau",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  const todayInChisinau = new Date().toLocaleDateString("en-US", options);
  const inputInChisinau = dateToCheck.toLocaleDateString("en-US", options);

  return todayInChisinau === inputInChisinau;
}

export function initialiseSession() {
  const [sessionId, setSessionId] = useStorage("session_id");
  const [sessionDate, setSessionDate] = useStorage("current_date");
  const [gameStatus, setGameStatus] = useStorage("game_status");
  const [currentRowIndex, setCurrentRowIndex] = useStorage("row_index");
  const [guessList, setGuessList] = useStorage("guess_list");

  useEffect(() => {
    const myDate = new Date();

    if (!sessionId || !validSession(sessionDate)) {
      const randomStr = window.crypto.randomUUID();
      setSessionId(randomStr);
      setSessionDate(myDate.toISOString());
      setGameStatus("in_progress");
      setCurrentRowIndex("0");
      setGuessList("[]");
    }
  }, [
    sessionId,
    setSessionId,
    setSessionDate,
    setGameStatus,
    setCurrentRowIndex,
    setGuessList,
  ]);
}
