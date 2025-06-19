import { message } from "@/components/ui/ex-message/helper";
import { I18nUtil } from "@/locales";

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
  if (config.data?.requestId) {
    config.headers["request-id"] = config.data.requestId;
  }
  return config;
};

const resInterceptor = (res: AxiosResponse) => {
  const { config, data, headers, request } = res;
  const { message: msg, statusCode } = data;
  if (statusCode === 101) {

    window.location.reload();
  }

  if (config.method?.toLowerCase() !== "get") {
    if (statusCode !== 200) {
      console.log("resInterceptor -> msg", msg);
      message.error(msg);
    }
  }

  return { req: { config, headers, request }, ...data };
};

request.interceptors.request.use(reqInterceptor);

request.interceptors.response.use(resInterceptor);
