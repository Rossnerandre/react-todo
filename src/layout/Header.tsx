import { useTranslation } from "react-i18next";
import { styled } from "@stitches/react";

const StyledHeader = styled("header", {
  backgroundColor: "#1677ff",
  height: 72,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export function Header() {
  const {t} = useTranslation();
  return (
    <StyledHeader>
      <h1>{t('header')}</h1>
    </StyledHeader>
  );
}
