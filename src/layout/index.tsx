import { Header } from "./Header";
import { Outlet } from "react-router-dom";
import { styled } from "@stitches/react";
import { light } from "../theme/light";
import { dark } from "../theme/dark";
import useThemeStore from "../store/themeStore";

const Main = styled("main", {
  background: "$background",
  minHeight: "100vh",
  textAlign: "center",
  padding: "40px 80px",
});

function MyLayout() {
  const store = useThemeStore();
  return (
    <>
      <Header />
      <Main className={store.theme === "light" ? light : dark}>
        <Outlet />
      </Main>
    </>
  );
}

export default MyLayout;
