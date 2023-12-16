import { BookAddType } from "./book";

export interface BorrowQueryType {
  name?: string;
  status?: string;
  author?: string;
  nickName?: string;
  borrowAt?: integer;
  publishAt?: integer;
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface BorrowAddType {
  name: string;
  author: string;
  category: number;
  cover: string;
  publishAt: number;
  stock: number;
}

export interface BorrowType {
  book?: BookSearchType;
  borrowAt: number;
  publishAt: number;
  //todo user ts
  user?: any;
}
