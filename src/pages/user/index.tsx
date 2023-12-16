import { getUserList, userDelete, userUpdate } from "@/api/user";
import Content from "@/components/Content";
import { UserQueryType, UserType } from "@/type";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  TablePaginationConfig,
  Tag,
  message,
} from "antd";
// import axios from "axios";
import dayjs from "dayjs";
// import { Inter } from "next/font/google";
// import Head from "next/head";
// import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// const inter = Inter({ subsets: ["latin"] });

const STATUS = {
  ON: "on",
  OFF: "off",
};
export const STATUS_OPTIONS = [
  { label: "正常", value: STATUS.ON },
  { label: "禁用", value: STATUS.OFF },
];
const COLUMNS = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    width: 160,
  },
  {
    title: "用户名",
    dataIndex: "nickName",
    key: "nickName",
    width: 160,
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (text: string) => {
      return text === STATUS.ON ? (
        <Tag color="green">正常</Tag>
      ) : (
        <Tag color="red">禁用</Tag>
      );
    },
  },

  {
    title: "出版日期",
    dataIndex: "createAt",
    key: "createAt",
    width: 120,
    render: (createAt: string) => dayjs(createAt).format("YYYY-MM-DD"),
  },
];

export default function User() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [dataSource, setDataSource] = useState([]);
  const [disabled, setDisabled] = useState(false);

  //分页
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 5,
    // showSizeChanger: true,
    total: 0,
  });

  //获取数据
  async function fetchData(values?: any) {
    const res = await getUserList({
      current: 1,
      pageSize: pagination.pageSize,
      total: pagination.total,
      ...values,
    });
    const { data } = res;
    setDataSource(data);
    setPagination({ ...pagination, total: res.total });
  }
  //一进入页面,获取数据
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //总条数
  // const [total, setTotal] = useState(0);
  //搜索

  const handleSearchFinish = async (values: UserQueryType) => {
    console.log(values);

    const userList = await getUserList({
      ...values,
      current: 1,
      pageSize: pagination.pageSize,
    });
    setDataSource(userList.data);
    setPagination({ ...pagination, current: 1, total: userList.total });
    console.log(userList.total);

    console.log(pagination.total);

    // bookList.map((values.name===bookList.data.||)=>)
  };
  //重置
  const handleSearchReset = () => {
    form.resetFields();
  };
  //编辑
  const handleUserEdit = (id: string) => {
    router.push(`/user/edit/${id}`);
  };
  //禁用
  const handleStatusEdit = async (row: UserType) => {
    const status = row.status === STATUS.ON ? STATUS.OFF : STATUS.ON;
    if (status === "off") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
    //更新
    await userUpdate({
      ...row,
      status,
    });
    fetchData(form.getFieldsValue());
  };

  //删除
  const handleUserDelete = (id: string) => {
    Modal.confirm({
      title: "确认删除",
      okText: "确定",
      cancelText: "取消",
      async onOk() {
        await userDelete(id);
        message.success("删除成功");
        fetchData(form.getFieldsValue());
      },
    });
  };

  //表格中分页、排序、筛选变化时触发
  const handleTableChange = (pagination: TablePaginationConfig) => {
    console.log(pagination);
    setPagination(pagination);

    //getFieldsValue获取所有输入框的值,getFieldsValue获取单个输入框得到值
    //分页查询时变化
    const query = form.getFieldsValue();
    console.log(query);

    getUserList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query,
    });
  };
  const columns = [
    ...COLUMNS,
    {
      title: "操作",

      key: "action",
      width: 150,

      //render虽返回内容,但也是个函数,要有return
      render: (_: any, row: any) => {
        return (
          <>
            <Space>
              <Button
                type="link"
                onClick={() => {
                  handleUserEdit(row._id);
                }}
              >
                编辑
              </Button>
              <Button
                type="link"
                danger={row.status === STATUS.ON ? true : false}
                disabled={disabled}
                onClick={() => {
                  handleStatusEdit(row);
                }}
              >
                {row.status === STATUS.ON ? "禁用" : "启用"}
              </Button>
              <Button
                type="link"
                danger
                onClick={() => {
                  handleUserDelete(row);
                }}
              >
                删除
              </Button>
            </Space>
          </>
        );
      },
    },
  ];
  return (
    <Content
      title="用户列表"
      operation={
        <Button
          type="primary"
          onClick={() => {
            router.push("/user/add");
          }}
        >
          添加
        </Button>
      }
    >
      <Form
        form={form}
        name="search"
        // 和栅格系统Row和Col冲突 layout="inline"
        onFinish={handleSearchFinish}
        initialValues={{
          name: " ",
          status: " ",
        }}
      >
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item name="name" label="名称">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item name="status" label="状态">
              <Select
                placeholder="请选择"
                allowClear
                showSearch
                options={STATUS_OPTIONS}
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
          dataSource={dataSource}
          // scroll={{ x: 1000 }}
          onChange={handleTableChange}
          //解构
          pagination={{
            ...pagination,
            // total,
            showTotal: () => `共${pagination.total}条`,
          }}
          size="middle"
        ></Table>
      </Form>
    </Content>
  );
}
