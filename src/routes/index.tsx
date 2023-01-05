import { createBrowserRouter } from "react-router-dom";
import MyLayout from "../layout";
import App from "../App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MyLayout />,
    children: [
      {
        index: true,
        element: <App />,
      },
    ],
  },
]);

export default router;
