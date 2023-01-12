import { useTranslation } from "react-i18next";
import { styled } from "@stitches/react";
import useThemeStore from "../store/themeStore";
import type { MenuProps } from "antd";
import { theme, Typography, Dropdown, Button, Switch } from "antd";
const { useToken } = theme;
const { Title, Text } = Typography;
import {
  MdOutlineLightMode,
  MdOutlineDarkMode,
  MdOutlineSettings,
} from "react-icons/md";
import useLoginStore from "../store/loginStore";
import useAuth from "../hooks/useAuth";

const StyledHeader = styled("header", {
  height: 82,
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  flexBasis: "50%",
});

export function Header() {
  const { theme, setTheme } = useThemeStore();
  const { nicknameUser } = useLoginStore();
  const { logout } = useAuth();
  const { t } = useTranslation();
  const { token } = useToken();

  const items: MenuProps["items"] = [
    {
      key: "1",
      style: { textAlign: "center" },
      label: (
        <Switch
          checkedChildren={<MdOutlineLightMode />}
          unCheckedChildren={<MdOutlineDarkMode />}
          onChange={() => setTheme()}
          checked={theme === "light" ? true : false}
        />
      ),
    },
    {
      key: "2",
      label: <Button>En/pt</Button>,
    },
    {
      key: "3",
      label: (
        <>{nicknameUser && <Button onClick={() => logout()}>Logout</Button>} </>
      ),
    },
  ];

  return (
    <StyledHeader
      style={{
        backgroundColor: `${
          theme === "light" ? token.colorPrimary : token.colorPrimaryBg
        }`,
      }}
    >
      <div>
        <Title level={2}>{t("header")}</Title>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {nicknameUser && (
          <Text style={{ paddingRight: 20 }}>Welcome {nicknameUser}</Text>
        )}
        <Dropdown menu={{ items }} placement="bottom" arrow>
          <Button style={{ paddingBottom: "0" }}>
            <MdOutlineSettings size={20} />
          </Button>
        </Dropdown>
      </div>
    </StyledHeader>
  );
}
