import create from "zustand";

type LoginStore = {
  isAuthenticated: boolean;
  nicknameUser: string;
  idUser: string;
  setAuthenticated: (users: any, auth: boolean, idUser: string) => void;
};

const useLoginStore = create<LoginStore>(
  (set): LoginStore => ({
    isAuthenticated: false,
    nicknameUser: "",
    idUser: "",
    setAuthenticated: (nickname, auth, idUser) =>
      set(() => ({
        isAuthenticated: auth,
        nicknameUser: nickname,
        idUser: idUser,
      })),
  })
);

export default useLoginStore;
