import { useTranslation } from "react-i18next";
import { styled } from "@stitches/react";
import { light } from "../theme/light";
import { dark } from "../theme/dark";
import useThemeStore from "../store/themeStore";
import { Switch } from "antd";

const StyledHeader = styled("header", {
  backgroundColor: "$primary",
  height: 82,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "$text",
});

export function Header() {
  const store = useThemeStore();
  const { t } = useTranslation();

  return (
    <StyledHeader className={store.theme === "light" ? light : dark}>
      <h1>{t("header")}</h1>
      <Switch onChange={() => store.setTheme()} />
    </StyledHeader>
  );
}
