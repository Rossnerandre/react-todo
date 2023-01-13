import api from "../services/api";
import useLoginStore from "../store/loginStore";
import { v4 as uuidv4 } from "uuid";
import useLocalStorage from "./useLocalStorage";
import useConfigStore from "../store/configStore";

type UserType = { email: string; username: string; password: string };

export default function useAuth() {
  const { setAuthenticated } = useLoginStore();
  const { setConfig } = useConfigStore();
  const { getItems, setItems, removeItems } = useLocalStorage();

  const autoAuth = async () => {
    try {
      const [username, isAuthenticated, idUser] = getItems([
        "username",
        "isAuthenticated",
        "idUser",
      ]);
      if (username && isAuthenticated === "true" && idUser) {
        const { data } = await api.get(`users?idUser=${idUser}`);
        setConfig(data[0].configTheme, data[0].configLang);
        setAuthenticated(username, true, idUser);
        return true;
      }
      return false;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  };

  const login = async ({ email, password }: Omit<UserType, "username">) => {
    try {
      const { data } = await api.get(`users?email=${email}`);
      if (data.length > 0) {
        if (data[0].password == password) {
          setItems([
            { key: "username", value: data[0].user },
            { key: "idUser", value: data[0].id },
            { key: "isAuthenticated", value: "true" },
          ]);
          setAuthenticated(data[0].user, true, data[0].id);
          setConfig(data[0].configTheme, data[0].configLang);
          return data.status;
        }
        return "Email or pass don't match";
      }
      return "Email or pass don't match";
    } catch (error) {
      throw new Error("Internal server error");
    }
  };

  const register = async ({ email, username, password }: UserType) => {
    try {
      const { data } = await api.get(`users?email=${email}`);
      if (data.length >= 1) {
        return "E-mails already registered!";
      }

      const id = uuidv4();

      const response = await api.post("users", {
        user: `${username}`,
        email: `${email}`,
        password: `${password}`,
        configTheme: "dark",
        configLang: "en",
        id: `${id}`,
      });

      setItems([
        { key: "username", value: username },
        { key: "idUser", value: id },
        { key: "isAuthenticated", value: "true" },
      ]);

      setAuthenticated(username, true, id);

      return response;
    } catch (error) {
      throw new Error("Internal server error");
    }
  };

  const logout = () => {
    removeItems(["username", "idUser", "isAuthenticated"]);
    setAuthenticated("", false, "");
    setConfig("dark", "en");
  };

  return { register, autoAuth, login, logout };
}
