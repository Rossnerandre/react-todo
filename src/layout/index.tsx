import { Header } from "./Header";
import { Outlet } from "react-router-dom";
import { styled } from "@stitches/react";
import useConfigStore from "../store/configStore";
import { ConfigProvider, theme } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
const { defaultAlgorithm, darkAlgorithm, useToken } = theme;

const Main = styled("main", {
  height: "calc(100vh - 82px)",
  width: "100%",
  textAlign: "center",
  padding: "40px 0",
});

function MyLayout() {
  const { theme, language } = useConfigStore();
  const { token } = useToken();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === "light" ? defaultAlgorithm : darkAlgorithm,
      }}
    >
      <Header />
      <Main
        style={{
          backgroundColor: `${
            theme === "light" ? token.colorPrimaryBg : "#333"
          }`,
        }}
      >
        <Outlet />
      </Main>
    </ConfigProvider>
  );
}

export default MyLayout;
