import { Button } from "antd";
import { useRef, useCallback } from "react";
import ModalForm, { ModalHandles } from "./components/ModalForm";
import TableTodo from "./components/TableTodo";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";

function App() {
  const modalRef = useRef<ModalHandles>(null);
  const { t } = useTranslation();

  const handleOpenMyModal = useCallback(() => {
    modalRef.current?.openMyModal();
  }, []);

  return (
    <>
      <ModalForm ref={modalRef} />
      <Button
        type="primary"
        onClick={() => handleOpenMyModal()}
        icon={<PlusOutlined />}
      >
        {t("newTodo")}
      </Button>
      <br />
      <br />
      <br />
      <TableTodo />
    </>
  );
}

export default App;
