import create from "zustand";

type Theme = "light" | "dark";
type Language = "pt" | "en";

type ConfigStore = {
  theme: Theme;
  language: Language;
  setConfig: (theme: Theme, language: Language) => void;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
};

const useConfigStore = create<ConfigStore>(
  (set): ConfigStore => ({
    theme: "dark",
    language: "en",
    setConfig: (theme, language) =>
      set(() => ({
        theme: theme,
        language: language,
      })),
    setLanguage: (language) =>
      set(() => ({
        language: language,
      })),
    setTheme: (theme) =>
      set(() => ({
        theme: theme,
      })),
  })
);

export default useConfigStore;
