import React, {
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Form, Modal, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import { useTranslation } from "react-i18next";
import { TodoType } from "../../types/todo";

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

  const onFinish = (values: any) => {
    console.log("Success:", values);
    setIsModalOpen(false);
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
        </Form>
      </Modal>
    </>
  );
};

export default forwardRef(ModalForm);
