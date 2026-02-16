import { useState, useEffect } from "react";

function getStorageValue<T>(key: string, defaultValue: T) {
  // Implementation
  return defaultValue;
}

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState(() => getStorageValue(key, defaultValue));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
