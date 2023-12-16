import { categoryDelete, getCategoryList } from "@/api/category";
import Content from "@/components/Content";
import { CategoryQueryType } from "@/type";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  TablePaginationConfig,
  Tag,
  Tooltip,
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

const LEVEL = {
  ONE: 1,
  TWO: 2,
};
export const LEVEL_OPTIONS = [
  { label: "级别1", value: LEVEL.ONE },
  { label: "级别2", value: LEVEL.TWO },
];
const COLUMNS = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    width: 160,
  },
  {
    title: "级别",
    dataIndex: "level",
    key: "level",
    width: 120,
    render: (text: number) => {
      return <Tag color={text === 1 ? "green" : "cyan"}>{`级别${text}`}</Tag>;
    },
  },
  {
    title: "所属分类",
    dataIndex: "parent",
    key: "parent",
    width: 120,

    //"??是判断有没有值，||是判断真假。"
    render: (text: { name: string }) => {
      return text?.name ?? "--";
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

export default function Category() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [dataSource, setDataSource] = useState([]);

  //分页
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 5,
    // showSizeChanger: true,
    total: 0,
  });

  //获取数据
  async function fetchData(values?: any) {
    const res = await getCategoryList({
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

  const handleSearchFinish = async (values: CategoryQueryType) => {
    console.log(values);

    const categoryList = await getCategoryList({
      ...values,
      current: 1,
      pageSize: pagination.pageSize,
    });
    setDataSource(categoryList.data);
    setPagination({ ...pagination, current: 1, total: categoryList.total });
    console.log(categoryList.total);

    console.log(pagination.total);

    // bookList.map((values.name===bookList.data.||)=>)
  };
  //重置
  const handleSearchReset = () => {
    form.resetFields();
  };
  //编辑
  const handleCategoryEdit = (id: string) => {
    router.push(`/category/edit/${id}`);
  };

  //删除
  const handleCategoryDelete = (id: string) => {
    Modal.confirm({
      title: "确认删除",
      okText: "确定",
      cancelText: "取消",
      async onOk() {
        await categoryDelete(id);
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

    getCategoryList({
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

      //render虽返回内容,但也是个函数,要有return
      render: (_: any, row: any) => {
        return (
          <>
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  handleCategoryEdit(row._id);
                }}
              >
                编辑
              </Button>
              <Button
                type="link"
                danger
                onClick={() => {
                  handleCategoryDelete(row);
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
      title="图书列表"
      operation={
        <Button
          type="primary"
          onClick={() => {
            router.push("/category/add");
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
          level: "",
        }}
      >
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item name="name" label="名称">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item name="level" label="级别">
              <Select
                placeholder="请选择"
                allowClear
                showSearch
                options={LEVEL_OPTIONS}
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
