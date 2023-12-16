import { BookAddType, BookSearchType, CategoryQueryType, CategoryType } from "@/type";
import axios from "axios";
import qs from "qs";

import http from "../utils/request";

// type BookSearchType = {
//   name: string;
//   author: string;
//   category: string;
// };

//获取分类列表
export async function getCategoryList(params?: CategoryQueryType) {
  // const res = await http.get(
  return http.get(
    `/api/categories?${qs.stringify(params)}`
    // `https://mock.apifox.cn/m1/2398938-0-default/api/books?${qs.stringify(
    //   params
    // )}`
    // "https://mock.apifox.cn/m1/2398938-0-default/api/books"
  );
  // console.log(res);
  // return res.data;
}

//分类列表添加
export async function categoryAdd(params?: CategoryType) {
  return http.post("/api/categories", params);
}

//分类列表删除
export async function categoryDelete(id: string) {
  return http.delete(`/api/categories/${id}`);
}
