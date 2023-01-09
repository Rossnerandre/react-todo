import React, {
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { Form, Modal, Input, DatePicker } from "antd";
import { useForm } from "antd/es/form/Form";
import { useTranslation } from "react-i18next";
import { TodoType } from "../../types/todo";
import { v4 as uuidv4 } from "uuid";
import { useFetchSWR } from "../../hooks/useFetchSWR";
import api from "../../services/api";
import dayjs from "dayjs";

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
  const { t } = useTranslation();
  const [form] = useForm();

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
      form.resetFields();
      setIsModalOpen(false);
      mutate();
    } catch (error) {
      console.log(error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Modal
        title="New Todo"
        open={isModalOpen}
        onOk={form.submit}
        onCancel={closeMyModal}
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
    </>
  );
};

export default forwardRef(ModalForm);
