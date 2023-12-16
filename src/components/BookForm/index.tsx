import { bookAdd } from "@/api/book";
import { getCategoryList } from "@/api/category";
import { BookAddType, CategoryType } from "@/type";
import {
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  Select,
  Space,
  message,
} from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import Content from "../Content";
import styles from "./index.module.css";

const { TextArea } = Input;
const BookForm = ({ title }: { title: string }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [preview, setPreview] = useState("");
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const handleFormFinish = async (values: BookAddType) => {
    if (values.publishAt) {
      //valueOf()将前面的部分转换成字符串
      values.publishAt = dayjs(values.publishAt).valueOf();
    }
    console.log(values);
    await bookAdd(values);
    message.success("创建成功");
    router.push("/book");
  };

  useEffect(() => {
    getCategoryList().then((res) => {
      setCategoryList(res.data);
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
          label="名称"
          name="name"
          rules={[{ required: true, message: "请输入名称" }, {}]}
        >
          <Input placeholder="请输入..." />
        </Form.Item>
        <Form.Item
          label="作者"
          name="author"
          rules={[{ required: true, message: "请输入作者" }, {}]}
        >
          <Input placeholder="请输入..." />
        </Form.Item>
        <Form.Item
          label="分类"
          name="category"
          rules={[{ required: true, message: "请选择分类" }, {}]}
        >
          <Select
            placeholder="请选择..."
            options={categoryList.map((item) => ({
              label: item.name,
              value: item._id,
            }))}
          ></Select>
        </Form.Item>
        <Form.Item label="封面" name="cover">
          {/* 组合input,需要表单组件之间紧凑连接且合并边框时，使用 Space.Compact */}
          <Space.Compact block={true} size="small">
            <Input placeholder="请输入..." />
            <Button
              type="primary"
              onClick={() => {
                const values = form.getFieldValue("cover");
                console.log(values);
                setPreview(values);
              }}
            >
              预览
            </Button>
          </Space.Compact>
        </Form.Item>
        {preview && (
          // label添加之后图片与上文对齐,colon去除冒号
          <Form.Item label=" " colon={false}>
            <Image src={preview} alt="图片加载失败啦" width={80} height={80} />
          </Form.Item>
        )}
        <Form.Item label="出版日期" name="publishAt">
          <DatePicker placeholder="请选择..." />
        </Form.Item>
        <Form.Item label="库存" name="stock">
          <InputNumber placeholder="请输入..." />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <TextArea rows={3} />
        </Form.Item>
        {/* 当label=" "没有中间的空格时,样式会出错,并且不显示冒号 */}
        <Form.Item label=" " colon={false}>
          <Button htmlType="submit" type="primary" className={styles.btn}>
            创建
          </Button>
        </Form.Item>
      </Form>
    </Content>
  );
};

export default BookForm;
