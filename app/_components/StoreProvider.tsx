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
  isLoaded: boolean;
  isModalOpen: boolean;
  editingMatch: Match | null;
}

interface StoreActions {
  updateSettings: (s: Settings) => void;
  addMatch: (m: Match) => void;
  editMatch: (m: Match) => void;
  deleteMatch: (id: string) => void;
  openModal: (match?: Match) => void;
  closeModal: () => void;
}

const StoreContext = createContext<(StoreState & StoreActions) | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  useEffect(() => {
    setSettings(loadSettings());
    setMatches(loadMatches());
    setIsLoaded(true);
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

  const editMatch = useCallback((m: Match) => {
    setMatches((prev) => {
      const next = prev.map((x) => (x.id === m.id ? m : x));
      saveMatches(next);
      return next;
    });
  }, []);

  const deleteMatch = useCallback((id: string) => {
    setMatches((prev) => {
      const next = prev.filter((x) => x.id !== id);
      saveMatches(next);
      return next;
    });
  }, []);

  const openModal = useCallback((match?: Match) => {
    setEditingMatch(match ?? null);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingMatch(null);
  }, []);

  return (
    <StoreContext.Provider
      value={{
        settings,
        matches,
        isLoaded,
        isModalOpen,
        editingMatch,
        updateSettings,
        addMatch,
        editMatch,
        deleteMatch,
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
