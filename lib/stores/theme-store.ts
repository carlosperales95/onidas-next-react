import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type ThemeMode = "light" | "dark" | "system"

interface ThemeStore {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: "system",
      setMode: (mode) => set({ mode }),
    }),
    {
      name: "athlete-hub-theme",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
