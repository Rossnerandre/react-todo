import { PlusOutlined } from "@ant-design/icons";
import { Modal, Button } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Form from "./Form";

interface Props {
  newTodo: boolean;
}

export default function OpenModal({ newTodo }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  const showModalTodo = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {newTodo ? (
        <Button type="primary" onClick={showModalTodo} icon={<PlusOutlined />}>
          {t("newTodo")}
        </Button>
      ) : (
        <>Make function</>
      )}
      <Modal
        title="New Todo"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
      >
        <Form newTodo />
      </Modal>
    </>
  );
}
