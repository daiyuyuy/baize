import { BorrowAddType, BorrowQueryType } from "@/type";
import qs from "qs";

import http from "../utils/request";

//获取借阅列表
export async function getBorrowList(params?: BorrowQueryType) {
  return http.get(`/api/borrows?${qs.stringify(params)}`);
}
//图书列表添加
export async function borrowAdd(params?: BorrowAddType) {
  return http.post("/api/borrows", params);
}

//图书列表删除
export async function borrowDelete(id: string) {
  return http.delete(`api/borrows/${id}`);
}
