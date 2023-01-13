import { useTranslation } from "react-i18next";
import { styled } from "@stitches/react";
import useConfigStore from "../store/configStore";
import { LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { theme, Typography, Dropdown, Button, Switch, Select } from "antd";
const { useToken } = theme;
const { Title, Text } = Typography;
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
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
  const { logout } = useAuth();
  const { theme, language } = useConfigStore();
  const { nicknameUser } = useLoginStore();
  const { ChangeLanguage, ChangeTheme } = useConfigs();
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
      disabled: true,
      label: (
        <Select
          defaultValue={language}
          style={{ width: "100%" }}
          onChange={(e: "pt" | "en") => ChangeLanguage(e)}
          options={[
            { value: "en", label: "EN-Us" },
            { value: "pt", label: "PT-Br" },
          ]}
        />
      ),
    },
    {
      key: "3",
      style: { textAlign: "center" },
      label: (
        <Button icon={<LogoutOutlined />} onClick={() => logout()}>
          {t("logout")}
        </Button>
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
          <>
            <Text style={{ paddingRight: 20, fontSize: 16 }}>
              {t("greetings")} {nicknameUser}
            </Text>
            <Dropdown menu={{ items }} placement="bottom" arrow>
              <Button>
                <SettingOutlined />
              </Button>
            </Dropdown>
          </>
        )}
      </div>
    </StyledHeader>
  );
}
