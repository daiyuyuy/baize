import { bookDelete, getBookList } from "@/api/book";
import { getCategoryList } from "@/api/category";
import Content from "@/components/Content";
import { BookSearchType, CategoryType } from "@/type";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Row,
  Select,
  Space,
  Table,
  TablePaginationConfig,
  Tooltip,
} from "antd";
// import axios from "axios";
import dayjs from "dayjs";
// import { Inter } from "next/font/google";
// import Head from "next/head";
// import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// const inter = Inter({ subsets: ["latin"] });

const COLUMNS = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    width: 160,
  },
  {
    title: "封面",
    dataIndex: "cover",
    key: "cover",
    width: 120,
    render: (cover: string) => {
      return <Image width={50} src={cover} alt=""></Image>;
    },
  },
  {
    title: "作者",
    dataIndex: "author",
    key: "author",
    width: 120,
  },
  {
    title: "分类",
    dataIndex: "category",
    key: "category",
    width: 120,
  },
  {
    title: "描述",
    dataIndex: "description",
    key: "description",
    width: 200,
    //超出时自动省略
    // ellipsis: true,
    ellipsis: {
      showTitle: false,
    },
    render: (description: any) => (
      //省略部分文字提示
      <Tooltip placement="topLeft" title={description}>
        {description}
      </Tooltip>
    ),
  },

  {
    title: "库存",
    dataIndex: "stock",
    key: "stock",
    width: 80,
  },
  {
    title: "出版日期",
    dataIndex: "createAt",
    key: "address",
    width: 120,
    render: (createAt: string) => dayjs(createAt).format("YYYY-MM-DD"),
  },
];

export default function Home() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [dataSource, setDataSource] = useState([]);

  //分类列表
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);

  //分页
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 5,
    // showSizeChanger: true,
    total: 0,
  });

  //获取数据
  async function fetchData(search?: BookSearchType) {
    const res = await getBookList({
      current: 1,
      pageSize: pagination.pageSize,
      total: pagination.total,
      ...search,
    });
    const { data } = res;
    setDataSource(data);
    setPagination({ ...pagination, current: 1, total: res.total });
  }
  //一进入页面,获取数据
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    //获取分类列表
    getCategoryList({ all: true }).then((res) => {
      setCategoryList(res.data);
    });
  }, []);
  //总条数
  // const [total, setTotal] = useState(0);
  //搜索

  const handleSearchFinish = async (values: BookSearchType) => {
    console.log(values);

    const bookList = await getBookList({
      ...values,
      current: 1,
      pageSize: pagination.pageSize,
    });
    setDataSource(bookList.data);
    setPagination({ ...pagination, current: 1, total: bookList.total });
    console.log(bookList);

    // bookList.map((values.name===bookList.data.||)=>)
  };
  //重置
  const handleSearchReset = () => {
    form.resetFields();
  };
  //编辑
  const handleBookEdit = (values: any, id: string) => {
    router.push(`/book/edit/${id}`);
    console.log(values);
    form.setFieldsValue(values);
  };

  //删除
  const handleBookDelete = (id: string) => {
    bookDelete(id);
    fetchData(form.getFieldsValue());
  };

  //表格中分页、排序、筛选变化时触发
  const handleTableChange = (pagination: TablePaginationConfig) => {
    console.log(pagination);
    setPagination(pagination);

    //getFieldsValue获取所有输入框的值,getFieldsValue获取单个输入框得到值
    //分页查询时变化
    const query = form.getFieldsValue();
    console.log(query);

    getBookList({
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

      //render虽然返回内容,但也是个函数,要有return
      render: (_: any, row: any) => {
        return (
          <>
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  handleBookEdit(row, row._id);
                }}
              >
                编辑
              </Button>
              <Button
                type="link"
                danger
                onClick={() => {
                  handleBookDelete(row._id);
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
            router.push("/book/add");
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
                options={categoryList.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
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
