import create from "zustand";

type LoginStore = {
  isAuthenticated: boolean;
  nicknameUser: string;
  setAuthenticated: (users: any, auth: boolean) => void;
};

const useLoginStore = create<LoginStore>(
  (set): LoginStore => ({
    isAuthenticated: false,
    nicknameUser: "",
    setAuthenticated: (nickname, auth) =>
      set(() => ({
        isAuthenticated: auth,
        nicknameUser: nickname,
      })),
  })
);

export default useLoginStore;
