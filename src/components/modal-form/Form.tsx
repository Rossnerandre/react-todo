import { Button, Form as FormAndt, Input } from "antd";
import {useTranslation} from 'react-i18next';

interface Props {
  newTodo: boolean;
  id?: string;
}
export default function Form(props: Props) {
  const { newTodo, id } = props;

  const {t}= useTranslation();

  const onFinish = (values: any) => {
    console.log("Success:", values);    
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <FormAndt
      name="Form Todo"
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <FormAndt.Item
        label={`${t('todo')}`}
        name="todo"
        rules={[{ required: true, message: `${t('todoInputError')}` }]}
      >
        <Input />
      </FormAndt.Item>
      <FormAndt.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          {newTodo ? "Add" : "Salvar"}
        </Button>
      </FormAndt.Item>
    </FormAndt>
  );
}
