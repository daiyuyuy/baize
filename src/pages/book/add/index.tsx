import BookForm from "@/components/BookForm";
import styles from "@/styles/Home.module.css";
import { Layout as AntdLayout } from "antd";
import { Inter } from "next/font/google";
import Head from "next/head";
import Image from "next/image";

// const { Header} = AntdLayout;
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <BookForm title="图书添加" />;
}
