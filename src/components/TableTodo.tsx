import { useState, useRef, useEffect } from "react";
import { Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import ModalForm, { ModalHandles } from "./modal-form/ModalForm";
import { useTranslation } from "react-i18next";
import { TodoType } from "../types/todo";
import { useFetchSWR } from "../hooks/useFetchSWR";
import api from "../services/api";

function TableTodo() {  
  const [editData, setEditData] = useState<TodoType | null>();
  const { t } = useTranslation();

  const { data, isLoading, mutate } = useFetchSWR<TodoType[]>("todos");

  useEffect(() => {

  }, []);

  const modalRef = useRef<ModalHandles>(null);

  function handleEditRow(record: TodoType) {
    setEditData(record);
    modalRef.current?.openMyModal();
  }

  async function handleDelete(record: TodoType) {
    try {
      api.delete(`todos/${record.id}`);
      mutate();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleCompleted(record: TodoType) {
    try {
      api.patch(`todos/${record.id}`, {
        completed: true
      });
      mutate();
    } catch (error) {
      console.log(error);
    }
  }

  const columns: ColumnsType<TodoType> = [
    {
      title: `${t("todo")}`,
      dataIndex: "todo",
      key: "todo",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEditRow(record)}>{t("editTodo")}</a>
          <a onClick={() => handleDelete(record)}>{t("Delete")}</a>
          <a onClick={() => handleCompleted(record)}>{t("Completed?")}</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        //@ts-ignore
        dataSource={data}
        // rowSelection={rowSelection}
        loading={isLoading}
      />
      <ModalForm ref={modalRef} dataTodo={editData} />
    </>
  );
}

export default TableTodo;
