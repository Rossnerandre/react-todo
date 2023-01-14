import { createBrowserRouter, Navigate } from "react-router-dom";
import MyLayout from "../layout";
import App from "../App";
import Login from "../pages/login/Login";

import { ReactNode } from "react";
import useLoginStore from "../store/loginStore";
import Register from "../pages/login/Register";

type AuthGuardProps = {
  children: ReactNode;
};

export function Protected({ children }: AuthGuardProps) {
  const { isAuthenticated } = useLoginStore();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MyLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/todos",
        element: (
          <Protected>
            <App />
          </Protected>
        ),
      },
    ],
  },
]);

export default router;
