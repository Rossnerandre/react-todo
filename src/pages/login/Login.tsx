import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography } from "antd";
import { styled } from "@stitches/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/useAuth";
const { Title, Text } = Typography;

const CardForm = styled("div", {
  h1: {
    marginBottom: 15,
  },
  height: "calc(100vh - 164px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  form: {
    width: 300,
    display: "flex",
    flexDirection: "column",
  },
  ".login-form-button ": {
    width: "100%",
    marginBottom: 12,
  },
});

export default function Login() {
  const { t } = useTranslation();
  const [messageError, setMessageError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { autoAuth, login } = useAuth();

  useEffect(() => {
    autoAuth().then((resp) => {
      if (resp) {
        nav("/todos");
      }
    });
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await login({
          email: values.email,
          password: values.password,
        });
        if (response === "Email or pass don't match") {
          throw new Error(response);
        }
        return nav("/todos");
      } catch (error: any) {
        if (error.message === "Email or pass don't match") {
          setMessageError(`${t("invalidAccess")}`);
          return;
        }
        setMessageError(`${t("internalServerError")}`);
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <CardForm>
      <Title level={1}>{t("titleWelcomeBack")}</Title>
      <Form
        name="loginForm"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onSubmitCapture={() => setMessageError(null)}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: `${t("errorEmailRequired")}` },
            {
              type: "email",
              message: `${t("errorEmailInvalid")}`,
            },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="E-mail" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: `${t("errorPasswordRequired")}` },
            {
              pattern: /^(?=.*[A-Z]).{0,}$/,
              message: `${t("mustContainCapital")}`,
            },
            {
              pattern: /^(?=.*[a-z]).{0,}$/,
              message: `${t("mustContainLower")}`,
            },
            {
              pattern: /^(?=.*[0-9]).{0,}$/,
              message: `${t("mustContainNumber")}`,
            },
            {
              pattern: /^(?=.*[!@#$%&]).{0,}$/,
              message: `${t("mustContainSpecial")}`,
            },
            {
              pattern: /^(?=.*[0-9a-zA-Z!@#$%&]).{8,}$/,
              message: `${t("mustContain8")}`,
            },
          ]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder={`${t("password")}`}
          />
        </Form.Item>
        {messageError && (
          <Text style={{ marginBottom: 12 }} type="danger">
            {messageError}
          </Text>
        )}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={loading}
          >
            {t("signIn")}
          </Button>
          <div>
            {t("or")} <a style={{fontSize: 17, fontWeight: 700 }} href="/register">{t("registerNow")}</a>
          </div>
        </Form.Item>
      </Form>
    </CardForm>
  );
}
