import { useState, useRef, useMemo } from "react";
import { Button, Popconfirm, Space, Switch, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import ModalForm, { ModalHandles } from "./modal-form/ModalForm";
import { useTranslation } from "react-i18next";
import { TodoType } from "../types/todo";
import { useFetchSWR } from "../hooks/useFetchSWR";
import api from "../services/api";
import dayjs from "dayjs";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { SorterResult } from "antd/es/table/interface";
import Notification, { NotificationHandles } from "./Notification";
import useLoginStore from "../store/loginStore";

function TableTodo() {
  const { idUser } = useLoginStore();
  const { t } = useTranslation();
  const [editData, setEditData] = useState<TodoType | null>();

  const [order, setOrder] = useState<string>("desc");
  const [orderColumn, setOrderColumn] = useState<string>("create_at");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, mutate, isLoading } = useFetchSWR(`todos`, {
    idUser,
    _sort: orderColumn,
    _order: order,
    _page: currentPage,
  });

  const modalRef = useRef<ModalHandles>(null);
  const notificationRef = useRef<NotificationHandles>(null);

  function handleEditRow(record: TodoType) {
    setEditData(record);
    modalRef.current?.openMyModal();
  }

  async function handleAction(record: TodoType, typeAction: string) {
    if (typeAction === "delete") {
      try {
        api.delete(`todos/${record.id}`);
        mutate();
        notificationRef.current?.openMyNotification(
          "sucess",
          `${t("sucessDelete")}`
        );
      } catch (error) {
        notificationRef.current?.openMyNotification(
          "error",
          `${t("errorDelete")}`
        );
        console.log(error);
      }
      return;
    }
    try {
      api.patch(`todos/${record.id}`, {
        completed: true,
      });
      mutate();
      notificationRef.current?.openMyNotification(
        "sucess",
        `${t("sucessUpdate")}`
      );
    } catch (error) {
      notificationRef.current?.openMyNotification(
        "sucess",
        `${t("errorUpdate")}`
      );
      console.log(error);
    }
  }

  const columns = useMemo<ColumnsType<TodoType>>(
    () => [
      {
        title: `${t("todo")}`,
        dataIndex: "todo",
        key: "todo",
        sorter: true,
        render: (text, record) => {
          return !record.completed ? <p>{text}</p> : <s>{text}</s>;
        },
      },
      {
        title: `${t("dateComplet")}`,
        dataIndex: "dateDoTodo",
        key: "dateDoTodo",
        sorter: true,
        render: (text) => {
          const dateFormat = dayjs(+text).format("DD/MM/YYYY HH:mm:ss");
          return <p>{dateFormat}</p>;
        },
      },
      {
        title: `${t("actionTable")}`,
        key: "action",
        render: (_, record) => (
          <Space size="middle">
            <Popconfirm
              title={t("deleteConfirm")}
              onConfirm={() => handleAction(record, "delete")}
            >
              <Button danger icon={<DeleteOutlined />}>
                {t("delete")}
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
              onClick={() => handleAction(record, "complete")}
            />
          </Space>
        ),
      },
    ],
    [t]
  );

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Table
        style={{ width: "700px" }}
        bordered
        columns={columns}
        dataSource={data ? data.data : []}
        loading={isLoading}
        onChange={(sorter) => {
          const sort = sorter as SorterResult<TodoType>;
          setOrderColumn(sort.field as string);
          setOrder((sort.order as string) === "ascend" ? "asc" : "desc");
        }}
        rowKey="id"
        pagination={{
          pageSize: 10,
          total: data ? +data.headers.get("x-total-count") : 1,
          onChange(page) {
            setCurrentPage(page);
          },
        }}
      />
      <ModalForm ref={modalRef} dataTodo={editData} />
      <Notification ref={notificationRef} />
    </div>
  );
}

export default TableTodo;
