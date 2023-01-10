import React, {
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from "react";
import { Form, Modal, Input, DatePicker, Button } from "antd";
import { useForm } from "antd/es/form/Form";
import { useTranslation } from "react-i18next";
import { TodoType } from "../../types/todo";
import { v4 as uuidv4 } from "uuid";
import { useFetchSWR } from "../../hooks/useFetchSWR";
import api from "../../services/api";
import dayjs from "dayjs";
import Notification, { NotificationHandles } from "../Notification";

export interface ModalHandles {
  openMyModal: () => {};
}

interface Props {
  dataTodo?: TodoType | null;
}
const ModalForm: React.ForwardRefRenderFunction<ModalHandles, Props> = (
  { dataTodo },
  ref
) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [form] = useForm();

  const notificationRef = useRef<NotificationHandles>(null);

  const { mutate } = useFetchSWR(`todos/?_sort=create_at&_order=desc&_page=1`);

  const openMyModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeMyModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useImperativeHandle(ref, (): any => {
    return {
      openMyModal,
    };
  });

  useEffect(() => {
    if (dataTodo) {
      form.setFieldsValue({
        todo: dataTodo.todo,
        dateDoTodo: dayjs(+dataTodo.dateDoTodo),
      });
    }
  }, [dataTodo]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const id = uuidv4();
      if (dataTodo) {
        await api.patch(`todos/${dataTodo.id}`, {
          todo: `${values.todo}`,
          dateDoTodo: `${Date.parse(values.dateDoTodo)}`,
          completed: false,
        });
      } else {
        await api.post("todos", {
          id: `${id}`,
          key: `${id}`,
          todo: `${values.todo}`,
          create_at: `${Date.now()}`,
          dateDoTodo: `${Date.parse(values.dateDoTodo)}`,
          completed: false,
        });
      }
      setTimeout(() => {
        setLoading(false);
        form.resetFields();
        setIsModalOpen(false);
        if (dataTodo) {
          notificationRef.current?.openMyNotification(
            "sucess",
            `${t('sucessUpdate')}`
          );
        } else {
          notificationRef.current?.openMyNotification(
            "sucess",
            `${t('sucessCreate')}`
          );
        }
        mutate();
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Modal
        title={dataTodo ? `${t("formEditTodo")}` : `${t("formNewTodo")}`}
        open={isModalOpen}
        onCancel={closeMyModal}
        footer={[
          <Button key="back" onClick={closeMyModal}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={form.submit}
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          name="Form Todo"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label={`${t("todo")}`}
            name="todo"
            rules={[{ required: true, message: `${t("todoInputError")}` }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={`${t("Date")}`}
            name="dateDoTodo"
            rules={[{ required: true, message: `${t("todoInputError")}` }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
        </Form>
      </Modal>
      <Notification ref={notificationRef} />
    </>
  );
};

export default forwardRef(ModalForm);
