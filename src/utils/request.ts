import { message as AntdMessage } from "antd";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import Router from "next/router";

interface AxiosInstanceType extends AxiosInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  options<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
}
export const CreateAxiosHttp = (
  config?: AxiosRequestConfig
): AxiosInstanceType => {
  const http = axios.create({
    timeout: 5000,
    ...config,
  });

  http.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  http.interceptors.response.use(
    (response: any) => {
      //是否已经登录,是否成功
      const { status, message, data } = response;
      if (status === 200) {
        return data;
      } else if (status === 201) {
        //无权限登录,跳转至登录页面
        return Router.push("/login");
      } else {
        //其他error
        AntdMessage.error(message || "服务器错误");
      }
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        return Router.push("/login");
      }
      AntdMessage.error(error?.response?.data?.message || "服务器错误");
      return Promise.reject(error);
    }
  );
  return http;
};

export default CreateAxiosHttp({});
