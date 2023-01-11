import api from "../services/api";
import useLoginStore from "../store/loginStore";

export default function useAuth() {
  const { setAuthenticated } = useLoginStore();

  const autoAuth = () => {
    const nicknameUser = localStorage.getItem("username");
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (nicknameUser && isAuthenticated === "true") {
      setAuthenticated(nicknameUser, true);
      return true;
    }
    return false;
  };

  const login = async (email: string, password: string) => {
    const response = await api
      .get(`users?email=${email}`)
      .then((data) => data.data);
    if (response.length > 0) {
      if (response[0].password == password) {
        localStorage.setItem("username", response[0].user);
        localStorage.setItem("isAuthenticated", "true");
        setAuthenticated(response[0].user, true);
      }
      return response.status;
    }
    throw new Error("Email or pass don't match");
  };

  const register = async (
    email: string,
    password: string,
    username: string
  ) => {
    const verifiEmail = await api
      .get(`users?email=${email}`)
      .then((data) => data.data);
    if (verifiEmail.length >= 1) {
      throw new Error("E-mail is registred!");
    }

    const response = await api.post("users", {
      user: `${username}`,
      email: `${email}`,
      password: `${password}`,
    });

    localStorage.setItem("username", username);
    localStorage.setItem("isAuthenticated", "true");

    setAuthenticated(username, true);

    return response;
  };

  return { register, autoAuth, login };
}
