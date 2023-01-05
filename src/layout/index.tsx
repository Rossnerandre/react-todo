import { Header } from "./Header";
import { Outlet } from "react-router-dom";
import { styled } from "@stitches/react";

const Main = styled("main", {
  minHeight: "100vh",
  textAlign: 'center',
  marginTop: 40,
  padding: '0 80px'
});

function MyLayout() {
  return (
    <>
      <Header />
      <Main>
        <Outlet />
      </Main>
    </>
  );
}

export default MyLayout;
