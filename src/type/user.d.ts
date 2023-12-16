export interface UserQueryType {
  name?: string;
  status?: string;
  current?: number;
  pageSize?: number;
}

export interface UserType {
  name: string;
  status: string;
  // status: "on" | "off";

  nickName: string;

  _id?: string;
}
