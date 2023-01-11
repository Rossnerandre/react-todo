import { useTranslation } from "react-i18next";
import { styled } from "@stitches/react";
import useThemeStore from "../store/themeStore";
import { Switch } from "antd";
import { theme, Typography } from "antd";
const { useToken } = theme;
const { Title } = Typography;
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";

const StyledHeader = styled("header", {
  height: 82,
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  flexBasis: "50%",
});

export function Header() {
  const store = useThemeStore();
  const { t } = useTranslation();
  const { token } = useToken();

  return (
    <StyledHeader
      style={{
        backgroundColor: `${
          store.theme === "light" ? token.colorPrimary : token.colorPrimaryBg
        }`,
      }}
    >
      <div>
        <Title level={2}>{t("header")}</Title>
      </div>
      <div>
        <Switch
          checkedChildren={<MdOutlineLightMode />}
          unCheckedChildren={<MdOutlineDarkMode />}
          onChange={() => store.setTheme()}
          checked={store.theme === "light" ? true : false}
        />
      </div>
    </StyledHeader>
  );
}
