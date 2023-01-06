import React, { useState, useRef } from "react";
import { Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import ModalForm, { ModalHandles } from "./modal-form/ModalForm";
import { useTranslation } from "react-i18next";
import { TodoType } from "../types/todo";

const data: TodoType[] = [
  {
    key: "1",
    todo: "Estudar",
    completed: true,
  },
  {
    key: "2",
    todo: "Trabalhar",
    completed: false,
  },
  {
    key: "3",
    todo: "Dormir",
    completed: false,
  },
];

function TableTodo() {
  const [editData, setEditData] = useState<TodoType | null>();
  const { t } = useTranslation();

  // const [select, setSelect] = useState({
  //   selectedRowKeys: [],
  //   loading: false,
  // });

  // console.log("selectedRowKeys", select);
  // const { selectedRowKeys, loading } = select;

  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: (selectedRowKeys: any) => {
  //     setSelect({
  //       ...select,
  //       selectedRowKeys: selectedRowKeys,
  //     });
  //   },
  // };

  const modalRef = useRef<ModalHandles>(null);

  function handleEditRow(record: TodoType) {
    setEditData(record);
    modalRef.current?.openMyModal();
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
        </Space>
      ),
    },
  ];
  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        // rowSelection={rowSelection}
      />
      <ModalForm ref={modalRef} dataTodo={editData} />
    </>
  );
}

export default TableTodo;
