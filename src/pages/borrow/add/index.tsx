import BorrowForm from "@/components/BorrowForm";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <BorrowForm title="借阅添加" />;
}
