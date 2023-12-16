import { BookAddType, BookSearchType } from "@/type";

import qs from "qs";

import http from "../utils/request";

// type BookSearchType = {
//   name: string;
//   author: string;
//   category: string;
// };

//获取图书列表
export async function getBookList(params?: BookSearchType) {
  // const res = await http.get(
  return http.get(
    `/api/books?${qs.stringify(params)}`
    // `https://mock.apifox.cn/m1/2398938-0-default/api/books?${qs.stringify(
    //   params
    // )}`
    // "https://mock.apifox.cn/m1/2398938-0-default/api/books"
  );
  // console.log(res);
  // return res.data;
}

//图书列表添加
export async function bookAdd(params?: BookAddType) {
  return http.post("/api/books", params);
}

//图书列表删除
export async function bookDelete(id: string) {
  return http.delete(`api/books/${id}`);
}
