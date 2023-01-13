import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography } from "antd";
import { styled } from "@stitches/react";
import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function Register() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const [messageError, setMessageError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await register({
          email: values.email,
          username: values.username,
          password: values.password,
        });
        if (response === "E-mails already registered!") {
          throw new Error("E-mails already registered!");
        }
        return nav("/todos");
      } catch (error: any) {
        if (error.message === "E-mails already registered!") {
          setMessageError(`${t("emailInUse")}`);
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
      <Title level={1}>{t("titleRegisterUser")}</Title>
      <Form
        name="registerForm"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onSubmitCapture={() => setMessageError(null)}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: `${t("errorUsernameRequired")}`,
              whitespace: true,
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder={`${t("username")}`} />
        </Form.Item>

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
          hasFeedback
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder={`${t("password")}`}
          />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: `${t("passwordConfirmRequired")}`,
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(`${t("passwordConfirmNotMatch")}`)
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            type="password"
            placeholder={`${t("passwordConfirm")}`}
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
            {t("register")}
          </Button>
          <div>
            {t("or")} <a style={{fontSize: 17, fontWeight: 700 }} href="/">{t("signInNow")}</a>
          </div>
        </Form.Item>
      </Form>
    </CardForm>
  );
}
