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

  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, isLoading, mutate } = useFetchSWR(
    `todos/?_page=${currentPage}`
  );
  const [dataTeste, setDataTeste] = useState<TodoType[]>([]);
  const [totalPages, setTotalPages] = useState<number>();

  useEffect(() => {
    if (data) {
      setDataTeste(data.data);
      setTotalPages(+data.headers.get("x-total-count"));
    }
  }, [totalPages, data]);

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
        completed: true,
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
        dataSource={dataTeste}        
        loading={isLoading}
        pagination={{
          pageSize: 10,
          total: totalPages,
          onChange(page) {
            setCurrentPage(page);
          },
        }}
      />
      <ModalForm ref={modalRef} dataTodo={editData} />
    </>
  );
}

export default TableTodo;
