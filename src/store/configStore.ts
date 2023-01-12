import create from "zustand";

type Theme = "light" | "dark" | "";
type Language = "pt" | "en" | "";

type ConfigStore = {
  theme: Theme;
  language: Language;
  setConfig: (theme: Theme, language: Language) => void;
  setChangeLanguage: (language: Language) => void;
  setThemeLanguage: (theme: Theme) => void;
};

const useConfigStore = create<ConfigStore>(
  (set): ConfigStore => ({
    theme: "",
    language: "",
    setConfig: (theme, language) =>
      set(() => ({
        theme: theme,
        language: language,
      })),
    setChangeLanguage: (language) =>
      set(() => ({
        language: language,
      })),
    setThemeLanguage: (theme) =>
      set(() => ({
        theme: theme,
      })),
  })
);

export default useConfigStore;
