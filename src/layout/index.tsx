import { Header } from "./Header";
import { Outlet } from "react-router-dom";

function MyLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default MyLayout;
