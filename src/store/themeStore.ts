import create from "zustand";

type ThemeStore = {
  theme: "light" | "dark";
  setTheme: () => void;
};

const useThemeStore = create<ThemeStore>(
  (set): ThemeStore => ({
    theme: "dark",
    setTheme: () =>
      set((state) => ({
        theme: state.theme === "dark" ? "light" : "dark",
      })),
  })
);

export default useThemeStore;
