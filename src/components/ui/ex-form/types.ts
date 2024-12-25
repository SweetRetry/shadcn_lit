import { ExForm, ExFormItem } from "./element";

export interface RuleItem {
  type?:
    | "required"
    | "max"
    | "min"
    | "len"
    | "maxLen"
    | "minLen"
    | "email"
    | "regexp";
  value?: number;
  message?: string; // 校验失败时的错误提示信息
  validator?: (value?: string) => Promise<void>;
}

export type ValidateStatus = "error" | "warning" | "success" | "default";



export type ValidateInfos<T extends Record<string, any> = Record<string, any>> =
  Record<keyof T, ValidateInfo>;

export interface ValidateInfo {
  status: ValidateStatus;
  message?: string;
}

declare global {
  interface HTMLElementTagNameMap {
    "ex-form": ExForm;
    "ex-form-item": ExFormItem;
  }
}
