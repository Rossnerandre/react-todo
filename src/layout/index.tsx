import { Header } from "./Header";
import { Outlet } from "react-router-dom";
import { styled } from "@stitches/react";
import useThemeStore from "../store/themeStore";
import { ConfigProvider, theme } from "antd";
const { defaultAlgorithm, darkAlgorithm, useToken } = theme;

const Main = styled("main", {
  height: "calc(100vh - 82px)",
  width: "100%",
  textAlign: "center",
  padding: "40px 0",
});

function MyLayout() {
  const store = useThemeStore();
  const { token } = useToken();
  return (
    <ConfigProvider
      theme={{
        algorithm: store.theme === "light" ? defaultAlgorithm : darkAlgorithm,
      }}
    >
      <Header />
      <Main
        style={{
          backgroundColor: `${
            store.theme === "light" ? token.colorPrimaryBg : "#333"
          }`,
        }}
      >
        <Outlet />
      </Main>
    </ConfigProvider>
  );
}

export default MyLayout;
