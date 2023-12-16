import CategoryForm from "@/components/CategoryForm";
import styles from "@/styles/Home.module.css";
import { Layout as AntdLayout } from "antd";
import { Inter } from "next/font/google";
import Head from "next/head";
import Image from "next/image";

// const { Header} = AntdLayout;
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <CategoryForm />;
}
