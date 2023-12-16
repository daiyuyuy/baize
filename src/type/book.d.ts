export interface BookSearchType {
  name?: string;
  author?: string;
  category?: number;
  current?: number;
  pageSize?: number;
  total?: number;
  stock?: integer;
  all?: boolean; //获取所有数据
  _id?: number;
}

export interface BookAddType {
  name: string;
  author: string;
  category: string;
  cover: string;
  publishAt: number;
  stock: number;
}
