import { I18nUtil } from "@/locales";
import { EX_MODULE_ENUM, handleModuleChange } from "@/utils/module";
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { stringify } from "qs";

export interface ExResponse<T = any> {
  content: T;
  statusCode: number;
  message: string;
}

export const request = axios.create({
  baseURL: "/api",
  timeout: 6000,
  paramsSerializer: {
    serialize: (params) => {
      // 过滤空值
      const filteredParams = Object.entries(params)
        .filter(([_key, value]) => value !== "")
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
      return stringify(filteredParams, {
        arrayFormat: "repeat",
        skipNulls: true,
      });
    },
  },
});

const reqInterceptor = (config: InternalAxiosRequestConfig<any>) => {
  const locale = I18nUtil.getLocale();
  if (locale) {
    config.headers["User-Lang"] = locale;

  }
  return config;
};

const resInterceptor = (res: AxiosResponse) => {
  const { config, data, headers, request } = res;
  const { message: msg, statusCode } = data;
  if (statusCode === 101) {
    handleModuleChange(EX_MODULE_ENUM.Login);
  }

  return { req: { config, headers, request }, ...data };
};

request.interceptors.request.use(reqInterceptor);

request.interceptors.response.use(resInterceptor);
