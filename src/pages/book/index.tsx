import styles from "@/styles/Home.module.css";
import { Button, Col, Form, Input, Row, Select, Space, Table } from "antd";
import { Inter } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const data = [
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
  {
    key: "3",
    name: "胡彦祖",
    age: 12,
    address: "西湖区湖底公园1号",
  },
  {
    key: "4",
    name: "胡彦祖",
    age: 52,
    address: "西湖区湖底公园1号",
  },
  {
    key: "4",
    name: "胡彦祖",
    age: 52,
    address: "西湖区湖底公园1号",
  },
  {
    key: "4",
    name: "胡彦祖",
    age: 52,
    address: "西湖区湖底公园1号",
  },
  {
    key: "4",
    name: "胡彦祖",
    age: 52,
    address: "西湖区湖底公园1号",
  },
  {
    key: "4",
    name: "胡彦祖",
    age: 52,
    address: "西湖区湖底公园1号",
  },
  {
    key: "4",
    name: "胡彦祖",
    age: 52,
    address: "西湖区湖底公园1号",
  },
  {
    key: "4",
    name: "胡彦祖",
    age: 52,
    address: "西湖区湖底公园1号",
  },
  {
    key: "4",
    name: "胡彦祖",
    age: 52,
    address: "西湖区湖底公园1号",
  },
  {
    key: "4",
    name: "胡彦祖",
    age: 52,
    address: "西湖区湖底公园1号",
  },
  {
    key: "4",
    name: "胡彦祖",
    age: 52,
    address: "西湖区湖底公园1号",
  },
  {
    key: "4",
    name: "胡彦祖",
    age: 52,
    address: "西湖区湖底公园1号",
  },
  {
    key: "4",
    name: "胡彦祖",
    age: 52,
    address: "西湖区湖底公园1号",
  },
];

const COLUMNS = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "封面",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "作者",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "分类",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "描述",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "库存",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "创建时间",
    dataIndex: "address",
    key: "address",
  },
];
export default function Home() {
  const [form] = Form.useForm();
  const router = useRouter();

  //分页
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
  });

  //总条数
  const [total, setTotal] = useState(0);
  //搜索
  const handleSearchFinish = (values: any) => {
    console.log(values);
  };
  //重置
  const handleSearchReset = () => {
    form.resetFields();
  };
  //编辑
  const handleBookEdit = () => {
    router.push("/book/edit");
  };

  const columns = [
    ...COLUMNS,
    {
      title: "操作",

      key: "action",
      //render虽然返回内容,但也是个函数,要有return
      render: (_: any, row: any) => {
        return (
          <>
            <Space>
              <Button type="link" onClick={handleBookEdit}>
                编辑
              </Button>
              <Button type="link" danger>
                删除
              </Button>
            </Space>
          </>
        );
      },
    },
  ];
  return (
    <>
      <Form
        form={form}
        name="search"
        // 和栅格系统Row和Col冲突 layout="inline"
        onFinish={handleSearchFinish}
        initialValues={{
          name: " ",
          author: " ",
          category: " ",
        }}
      >
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item name="name" label="名称">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="author" label="作者">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="category" label="分类">
              <Select
                placeholder="请选择"
                allowClear
                showSearch
                options={[
                  { value: "jack", label: "Jack" },
                  { value: "lucy", label: "Lucy" },
                  { value: "Yiminghe", label: "yiminghe" },
                  { value: "disabled", label: "Disabled", disabled: true },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
                <Button htmlType="submit" onClick={handleSearchReset}>
                  清空
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: 1000 }}
          //解构
          pagination={{
            ...pagination,
            total,
            showTotal: () => `共${total}条`,
          }}
        ></Table>
      </Form>
    </>
  );
}
