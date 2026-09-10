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
    timeZone: 'Europe/Chisinau', 
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric' 
  };
  
  const todayInChisinau = new Date().toLocaleDateString('en-US', options);
  const inputInChisinau = dateToCheck.toLocaleDateString('en-US', options);

  return todayInChisinau === inputInChisinau;
}
