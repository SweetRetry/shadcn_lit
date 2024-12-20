import { z } from "zod";

export function buildZodSchema(
  rules: Record<
    string,
    {
      type: "string" | "number" | "regexp" | "email";
      required: boolean;
      minLength?: number;
      maxLength?: number;
      min?: number;
      max?: number;
      message?: string;
      validator?: (value: string) => boolean;
    }
  >,
) {
  const schema: Record<string, any> = {};

  for (const field in rules) {
    const rule = rules[field];
    let zodValidation = z.string() as any; // 默认使用 string 类型

    if (rule.type === "string") {
      zodValidation = z.string();
      if (rule.minLength)
        zodValidation = zodValidation.min(rule.minLength, rule.message);
      if (rule.maxLength)
        zodValidation = zodValidation.max(rule.maxLength, rule.message);
      if (rule.required) zodValidation = zodValidation.min(1, rule.message); // 处理必填字段
    } else if (rule.type === "number") {
      zodValidation = z.number();
      if (rule.min) zodValidation = zodValidation.min(rule.min, rule.message);
      if (rule.max) zodValidation = zodValidation.max(rule.max, rule.message);
      if (rule.required)
        zodValidation = zodValidation.refine(
          (val: any) => val != null,
          rule.message,
        ); // 处理必填字段
    }

    if (rule.type === "email") {
      zodValidation = zodValidation.email(rule.message);
    }

    schema[field] = zodValidation;
  }

  return z.object(schema); // 返回 Zod schema
}
