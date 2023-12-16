import { categoryAdd, getCategoryList } from "@/api/category";
import { LEVEL_OPTIONS } from "@/pages/category";
import { CategoryType } from "@/type";
import { Button, Form, Input, Select, message } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";

import Content from "../Content";
import styles from "./index.module.css";

export default function CategoryForm ({title}:{title:string}) {
  const [form] = Form.useForm();
  const router = useRouter();
  //所属分类列表数组
  const [levelOneList, setLevelOneList] = useState<CategoryType[]>([]);
  const [level, setLevel] = useState(1);

  const handleFormFinish = async (values: CategoryType) => {
    console.log(values);
    await categoryAdd(values);
    message.success("创建成功");
    router.push("/category");
  };

  useEffect(() => {
    async function fetchData() {
      const res = await getCategoryList({ all: true, level: 1 });
      setLevelOneList(res.data);
    }
    fetchData();
  }, []);
  //所属分类options
  const levelOneOptions = useMemo(() => {
    return levelOneList.map((item) => ({
      //Select选择器下的options属性就是label和value
      value: item._id,
      label: item.name,
    }));
  }, [levelOneList]);
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
          rules={[{ required: true, message: "请输入名称" }]}
        >
          <Input placeholder="请输入..." />
        </Form.Item>
        <Form.Item
          label="级别"
          name="level"
          rules={[{ required: true, message: "请选择级别" }]}
        >
          <Select
            placeholder="请选择"
            options={LEVEL_OPTIONS}
            onChange={(value) => {
              console.log(value);

              setLevel(value);
            }}
          ></Select>
        </Form.Item>
        {level === 2 && (
          <Form.Item
            label="所属级别"
            name="parent"
            rules={[{ required: true, message: "请选择级别" }, {}]}
          >
            <Select placeholder="请选择" options={levelOneOptions}></Select>
          </Form.Item>
        )}
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

// export default CategoryForm;
