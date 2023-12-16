import { UserQueryType, UserType } from "@/type";
import axios from "axios";
import qs from "qs";

import http from "../utils/request";

// type BookSearchType = {
//   name: string;
//   author: string;
//   user: string;
// };

//获取用户列表
export async function getUserList(params?: UserQueryType) {
  // const res = await http.get(
  return http.get(
    `/api/users?${qs.stringify(params)}`
    // `https://mock.apifox.cn/m1/2398938-0-default/api/books?${qs.stringify(
    //   params
    // )}`
    // "https://mock.apifox.cn/m1/2398938-0-default/api/books"
  );
  // console.log(res);
  // return res.data;
}

//用户列表添加
export async function userAdd(params?: UserType) {
  return http.post("/api/users", params);
}

//用户列表删除
export async function userDelete(id: string) {
  return http.delete(`/api/users/${id}`);
}

//用户
export async function userUpdate(params: UserType) {
  // return http.put("/api/users", params);
  return http.put(`/api/users/${params._id}`, params);
}
