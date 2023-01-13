import api from "../services/api";
import useConfigStore from "../store/configStore";
import useLoginStore from "../store/loginStore";

export default function useConfigs() {
  const { setLanguage, setTheme, theme } = useConfigStore();
  const { idUser } = useLoginStore();

  const ChangeLanguage = (lang: "en" | "pt") => {
    api.patch(`users/${idUser}`, { configLang: lang });
    setLanguage(lang);
  };

  const ChangeTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    api.patch(`users/${idUser}`, { configTheme: newTheme });
    setTheme(newTheme);
  };

  return { ChangeLanguage, ChangeTheme };
}
