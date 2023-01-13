import { useState, useRef, useMemo } from "react";
import { Button, Popconfirm, Space, Switch, Table, Input, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import ModalForm, { ModalHandles } from "./modal-form/ModalForm";
import { useTranslation } from "react-i18next";
import { TodoType } from "../types/todo";
import { useTodos } from "../hooks/useTodos";
import api from "../services/api";
import dayjs from "dayjs";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { SorterResult } from "antd/es/table/interface";
import Notification, { NotificationHandles } from "./Notification";
import useLoginStore from "../store/loginStore";

function TableTodo() {
  const { idUser } = useLoginStore();
  const { t } = useTranslation();
  const [editData, setEditData] = useState<TodoType | null>();

  const [filters, setFilters] = useState("");

  const [order, setOrder] = useState<string>("desc");
  const [orderColumn, setOrderColumn] = useState<string>("create_at");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, mutate, isLoading } = useTodos(
    `todos-${orderColumn}-${order}-${currentPage}-${filters}`,
    {
      idUser,
      todo_like: filters !== "" ? filters : undefined,
      _sort: orderColumn,
      _order: order,
      _page: currentPage,
    }
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFilters(() => e.target.value);
  };

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
        title: `${t("dateComplete")}`,
        dataIndex: "dateDoTodo",
        key: "dateDoTodo",
        width: 200,
        sorter: true,
        render: (text) => {
          const dateFormat = dayjs(+text).format("DD/MM/YYYY HH:mm:ss");
          return <p>{dateFormat}</p>;
        },
      },
      {
        title: `${t("actionTable")}`,
        key: "action",
        align: "center",
        width: 170,
        render: (_, record) => (
          <Space size="middle">
            <Tooltip title={`${t("deleteTodo")}`}>
              <Popconfirm
                title={t("deleteConfirm")}
                onConfirm={() => handleAction(record, "delete")}
              >
                <Button danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
            <Tooltip title={`${t("editTodo")}`}>
              <Button
                onClick={() => handleEditRow(record)}
                icon={<EditOutlined />}
                disabled={record.completed}
              />
            </Tooltip>
            <Tooltip title={record.completed ? t("doneTodo") : t("finishTodo")}>
              <Switch
                disabled={record.completed}
                checked={record.completed}
                onClick={() => handleAction(record, "complete")}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [t]
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <div style={{ width: "100%" }}>
        <Input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e)}
          placeholder={`${t("searchTodo")}`}
          style={{ maxWidth: "700px" }}
          prefix={<SearchOutlined />}
        />
        <br />
        <br />
      </div>
      <Table
        style={{ width: "700px" }}
        size="small"
        bordered
        columns={columns}
        dataSource={data ? data.data : []}
        expandable={{
          expandedRowRender: (record) => (
            <p
              style={{ marginBottom: 0, marginLeft: 15, textAlign: "justify" }}
            >
              {record.description}
            </p>
          ),
          rowExpandable: (record) => record?.description !== "",
        }}
        loading={isLoading}
        onChange={(_, __, sorter) => {
          const sort = sorter as SorterResult<TodoType>;
          setOrderColumn(sort.field as string);
          if (sort.order !== undefined) {
            setOrder((sort.order as string) === "ascend" ? "asc" : "desc");
            return;
          }
          setOrderColumn("create_at");
          setOrder("desc");
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
      <ModalForm
        ref={modalRef}
        dataTodo={editData}
        orderColumn={orderColumn}
        order={order}
        filter={filters}
        currentPage={currentPage}
      />
      <Notification ref={notificationRef} />
    </div>
  );
}

export default TableTodo;
