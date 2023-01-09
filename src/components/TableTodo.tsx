import { useState, useRef, useEffect, useCallback } from "react";
import { Button, Popconfirm, Space, Switch, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import ModalForm, { ModalHandles } from "./modal-form/ModalForm";
import { useTranslation } from "react-i18next";
import { TodoType } from "../types/todo";
import { useFetchSWR } from "../hooks/useFetchSWR";
import api from "../services/api";
import dayjs from "dayjs";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

function TableTodo() {
  const [editData, setEditData] = useState<TodoType | null>();
  const { t } = useTranslation();

  const [order, setOrder] = useState<string>("desc");
  const [orderColumn, setOrderColumn] = useState<string>("create_at");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, isLoading, mutate } = useFetchSWR(
    `todos/?_sort=${orderColumn}&_order=${order}&_page=${currentPage}`
  );
  const [dataTodo, setDataTodo] = useState<TodoType[]>([]);
  const [totalPages, setTotalPages] = useState<number>();

  const orders = useCallback(
    (local: string, order: any) => {
      setOrderColumn(local);
      setOrder(order === "descend" ? "desc" : "asc");
    },
    [order, orderColumn]
  );

  useEffect(() => {
    if (data) {
      setDataTodo(data.data);
      setTotalPages(+data.headers.get("x-total-count"));
    }
  }, [totalPages, data, dataTodo]);

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
      sorter: (a, b, c) => {
        orders("todo", c);
        return 0;
      },
      render: (text, record) => {
        return !record.completed ? <p>{text}</p> : <s>{text}</s>;
      },
    },
    {
      title: `${t("Date To Make")}`,
      dataIndex: "dateDoTodo",
      key: "dateDoTodo",
      sorter: (a, b, c) => {
        orders("dateDoTodo", c);
        return 0;
      },
      render: (text) => {
        const dateFormat = dayjs(+text).format("DD/MM/YYYY HH:mm:ss");
        return <p>{dateFormat}</p>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />}>
              {t("Delete")}
            </Button>
          </Popconfirm>
          <Button
            onClick={() => handleEditRow(record)}
            icon={<EditOutlined />}
            disabled={record.completed}
          >
            {t("editTodo")}
          </Button>
          <Switch
            disabled={record.completed}
            checked={record.completed}
            onClick={() => handleCompleted(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Table
        style={{ width: "700px" }}
        bordered
        columns={columns}
        tableLayout="auto"
        dataSource={dataTodo}
        loading={isLoading}
        onChange={(record) => {
          console.log(record);
        }}
        // rowClassName={(record) => (record.completed ? "disabled-row" : "")}
        pagination={{
          pageSize: 10,
          total: totalPages,
          onChange(page) {
            setCurrentPage(page);
          },
        }}
      />
      <ModalForm ref={modalRef} dataTodo={editData} />
    </div>
  );
}

export default TableTodo;
