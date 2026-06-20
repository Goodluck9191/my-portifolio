"use client";

import { createContext, useContext, ReactNode } from "react";

const SettingsContext = createContext<Record<string, string>>({});

export function SettingsProvider({
  initialSettings,
  children,
}: {
  initialSettings: Record<string, string>;
  children: ReactNode;
}) {
  return (
    <SettingsContext.Provider value={initialSettings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(key: string, fallback: string): string {
  const settings = useContext(SettingsContext);
  return settings[key] ?? fallback;
}
