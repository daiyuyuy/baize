import { getBookList } from "@/api/book";
import { borrowDelete, getBorrowList } from "@/api/borrow";
import Content from "@/components/Content";
import { BookSearchType, BorrowQueryType, BorrowType } from "@/type";
import {
  Button,
  Col,
  Form,
  Row,
  Select,
  Space,
  Table,
  TablePaginationConfig,
  Tag,
} from "antd";
// import axios from "axios";
import dayjs from "dayjs";
// import { Inter } from "next/font/google";
// import Head from "next/head";
// import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// const inter = Inter({ subsets: ["latin"] });

const STATUS_OPTIONS = [
  //Select options中的value:	默认根据此属性值进行筛选	string | numberF
  {
    label: "借出",
    value: "on",
  },
  {
    label: "归还",
    value: "off",
  },
];
const COLUMNS = [
  {
    title: "书籍名称",
    dataIndex: "bookName",
    key: "bookName",
    width: 160,
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (text: string) => {
      // return <Tag color={text === "on" ? "green" : "orange"}>{text}</Tag>;
      return text === "on" ? (
        <Tag color="red">借出</Tag>
      ) : (
        <Tag color="green">归还</Tag>
      );
    },
    //   return <Tag color={}></Tag>
    // },
  },

  {
    title: "借阅人",
    dataIndex: "borrowUser",
    key: "borrowUser",
    width: 120,
  },

  {
    title: "借阅时间",
    dataIndex: "borrowAt",
    key: "borrowAt",
    width: 120,
    render: (createAt: string) => dayjs(createAt).format("YYYY-MM-DD"),
  },
  {
    title: "归还时间",
    dataIndex: "publishAt",
    key: "publishAt",
    width: 120,
    render: (createAt: string) => dayjs(createAt).format("YYYY-MM-DD"),
  },
];

export default function Borrow() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [dataSource, setDataSource] = useState([]);

  //书籍列表
  const [bookList, setBookList] = useState<BookSearchType[]>([]);
  //分页
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 5,
    // showSizeChanger: true,
    total: 0,
  });
  //借阅人
  //todo ts type
  const [userList, setUserList] = useState<any[]>([]);

  //获取数据
  async function fetchData(search?: BorrowQueryType) {
    const res = await getBorrowList({
      current: 1,
      pageSize: pagination.pageSize,
      total: pagination.total,
      ...search,
    });
    const newData = res.data.map((item: BorrowType) => ({
      ...item,
      bookName: item.book.name,
      borrowUser: item.user.nickName,
    }));
    setDataSource(newData);
    setPagination({ ...pagination, current: 1, total: res.total });
    console.log(res);
  }
  //一进入页面,获取数据
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    //获取书籍列表
    getBookList({ all: true }).then((res) => {
      setBookList(res.data);
    });
  }, []);
  //总条数
  // const [total, setTotal] = useState(0);
  //搜索

  const handleSearchFinish = async (values: BorrowQueryType) => {
    console.log(values);

    const res = await getBorrowList({
      ...values,
      current: 1,
      pageSize: pagination.pageSize,
    });
    console.log(res.data);

    const newData = res.data.map((item: BorrowType) => ({
      ...item,
      bookName: item.book.name,
      borrowUser: item.user.nickName,
    }));
    console.log(newData.bookName, newData.borrowUser);

    setDataSource(newData);
    setPagination({ ...pagination, current: 1, total: res.total });
    console.log(res);

    // bookList.map((values.name===bookList.data.||)=>)
  };
  //重置
  const handleSearchReset = () => {
    form.resetFields();
  };
  //编辑
  const handleBorrowEdit = (values: any, id: string) => {
    router.push(`/borrow/edit/${id}`);
    console.log(values);
    form.setFieldsValue(values);
  };

  //删除
  const handleBookDelete = (id: string) => {
    borrowDelete(id);
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
      width: 150,

      //render虽然返回内容,但也是个函数,要有return
      render: (_: any, row: any) => {
        return (
          <>
            <Space>
              <Button
                type="link"
                onClick={() => {
                  handleBorrowEdit(row, row._id);
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
      title="借阅列表"
      operation={
        <Button
          type="primary"
          onClick={() => {
            router.push("/borrow/add");
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
            <Form.Item name="bookName" label="书籍名称">
              <Select
                placeholder="请选择"
                allowClear
                //showSearch:配置是否可搜索
                showSearch
                //对内嵌内容进行搜索,通过options配置时,一般用label
                optionFilterProp="label"
                options={bookList.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="status" label="状态">
              <Select
                placeholder="请选择"
                allowClear
                options={STATUS_OPTIONS}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="borrowUser" label="借阅人">
              <Select
                placeholder="请选择"
                allowClear
                showSearch
                options={userList.map((item) => ({
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
