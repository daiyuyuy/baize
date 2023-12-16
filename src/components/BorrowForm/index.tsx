import { getBookList } from "@/api/book";
import { borrowAdd } from "@/api/borrow";
import { getUserList } from "@/api/user";
import { BookSearchType, BorrowAddType, UserType } from "@/type";
import { Button, Form, Input, Select, message } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import Content from "../Content";
import styles from "./index.module.css";

const { TextArea } = Input;
const BorrowForm = ({ title }: { title: string }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [stock, setStock] = useState<number>(0);
  const [bookList, setBookList] = useState<BookSearchType[]>([]);
  const [userList, setUserList] = useState<UserType[]>([]);
  const handleFormFinish = async (values: BorrowAddType) => {
    await borrowAdd(values);
    message.success("创建成功");
    router.push("/borrow");
  };

  useEffect(() => {
    getUserList().then((res) => {
      setUserList(res.data);
    });
    getBookList().then((res) => {
      setBookList(res.data);
    });
  }, []);
  return (
    <Content title={title}>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        // style={{ maxWidth: 600 }}
        form={form}
        size="small"
        className={styles.form}
        onFinish={handleFormFinish}
      >
        {" "}
        <Form.Item
          label="书籍名称"
          name="name"
          rules={[{ required: true, message: "请选择" }, {}]}
        >
          <Select
            placeholder="请选择..."
            options={bookList.map((item) => ({
              label: item.name,
              value: item._id,
              stock: item.stock,
            }))}
            onChange={(value, option) => {
              setStock(option.stock);
            }}
          ></Select>
        </Form.Item>
        <Form.Item
          label="借阅用户"
          name="nickName"
          rules={[{ required: true, message: "请选择" }, {}]}
        >
          <Select
            placeholder="请选择..."
            options={userList.map((item) => ({
              label: item.name,
              value: item._id,
            }))}
          ></Select>
        </Form.Item>
        <Form.Item label="书籍库存" name="stock">
          {stock}
        </Form.Item>
        {/* 当label=" "没有中间的空格时,样式会出错,并且不显示冒号 */}
        <Form.Item label=" " colon={false}>
          <Button
            htmlType="submit"
            type="primary"
            className={styles.btn}
            //库存小于0时禁用创建按钮
            disabled={!(stock > 0)}
          >
            创建
          </Button>
        </Form.Item>
      </Form>
    </Content>
  );
};

export default BorrowForm;
