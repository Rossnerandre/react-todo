import { useTranslation } from "react-i18next";
import { styled } from "@stitches/react";
import useConfigStore from "../store/configStore";
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
import useConfigs from "../hooks/useConfigs";

const StyledHeader = styled("header", {
  height: 82,
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
});

export function Header() {
  const { theme } = useConfigStore();
  const { ChangeLanguage, ChangeTheme } = useConfigs();
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
          onChange={() => ChangeTheme()}
          checked={theme === "light" ? true : false}
        />
      ),
    },
    {
      key: "2",
      style: { textAlign: "center" },
      label: <Button onClick={() => ChangeLanguage()}>En/pt</Button>,
    },
    {
      key: "3",
      style: { textAlign: "center" },
      label: (
        <>
          {nicknameUser && (
            <Button onClick={() => logout()}>{t("logout")}</Button>
          )}
        </>
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
        <Title level={2} style={{ margin: 0 }}>
          {t("header")}
        </Title>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {nicknameUser && (
          <Text style={{ paddingRight: 20, fontSize: 16 }}>
            {t("greetings")} {nicknameUser}
          </Text>
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
