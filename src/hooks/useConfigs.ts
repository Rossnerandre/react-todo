import useConfigStore from "../store/configStore";
import useLocalStorage from "./useLocalStorage";
export default function useConfigs() {
  const { getItems, setItems } = useLocalStorage();
  const { setConfig, setChangeLanguage, setThemeLanguage, language, theme } =
    useConfigStore();

  const verifyConfig = () => {
    const items = getItems(["theme", "language"]);
    if (items[0] === null && items[1] === null) {
      setConfig("dark", "en");
      setItems([
        { key: "theme", value: "dark" },
        { key: "language", value: "en" },
      ]);
      return;
    }

    //@ts-ignore
    setConfig(items[0], "pt");
    if (items[0] && items[1]) {
      setItems([
        { key: "theme", value: items[0] },
        { key: "language", value: items[1] },
      ]);
    }
  };

  const ChangeLanguage = () => {
    const newlanguage = language === "en" ? "pt" : "en";
    setChangeLanguage(newlanguage);
    setItems([{ key: "language", value: newlanguage }]);
  };

  const ChangeTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setThemeLanguage(newTheme);
    setItems([{ key: "theme", value: newTheme }]);
  };

  return { verifyConfig, ChangeLanguage, ChangeTheme };
}
