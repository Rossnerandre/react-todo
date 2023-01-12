import api from "../services/api";
import useLoginStore from "../store/loginStore";
import { v4 as uuidv4 } from "uuid";
import useLocalStorage from "./useLocalStorage";

export default function useAuth() {
  const { setAuthenticated } = useLoginStore();
  const { getItems, setItems } = useLocalStorage();

  const autoAuth = () => {
    const localItems = getItems(["username", "isAuthenticated", "idUser"]);
    if (localItems[0] && localItems[1] === "true" && localItems[2]) {
      setAuthenticated(localItems[0], true, localItems[2]);
      return true;
    }
    return false;
  };

  const login = async (email: string, password: string) => {
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
          return data.status;
        }
        return "Email or pass don't match";
      }
      return "Email or pass don't match";
    } catch (error) {
      throw new Error("Internal server error");
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string
  ) => {
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

  return { register, autoAuth, login };
}
