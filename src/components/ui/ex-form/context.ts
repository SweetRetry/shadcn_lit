import { createContext } from "@lit/context";
import { ExFormItem } from "./element";

export interface FormContextProvide<
  T extends Record<string, any> = Record<string, any>,
> {
  validate: (nameList?: string[]) => Promise<T | undefined>;
  setFieldValue: (name: keyof T, value: T[keyof T]) => Promise<void>;
  getFieldValue: (field: keyof T) => T[keyof T] | undefined;
  getFieldsValue: () => T | undefined;
  setFormItem: (formItem: ExFormItem) => void;
}

export const formContext = createContext<FormContextProvide>(
  Symbol("ex-form-context"),
);
