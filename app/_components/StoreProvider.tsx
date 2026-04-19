"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Match, Settings } from "../_types";
import {
  loadMatches,
  loadSettings,
  saveMatches,
  saveSettings,
} from "../_lib/storage";

interface StoreState {
  settings: Settings | null;
  matches: Match[];
  isModalOpen: boolean;
}

interface StoreActions {
  updateSettings: (s: Settings) => void;
  addMatch: (m: Match) => void;
  openModal: () => void;
  closeModal: () => void;
}

const StoreContext = createContext<(StoreState & StoreActions) | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    setMatches(loadMatches());
  }, []);

  const updateSettings = useCallback((s: Settings) => {
    setSettings(s);
    saveSettings(s);
  }, []);

  const addMatch = useCallback((m: Match) => {
    setMatches((prev) => {
      const next = [m, ...prev];
      saveMatches(next);
      return next;
    });
  }, []);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <StoreContext.Provider
      value={{
        settings,
        matches,
        isModalOpen,
        updateSettings,
        addMatch,
        openModal,
        closeModal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
