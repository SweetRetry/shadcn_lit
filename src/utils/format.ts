import currency from "currency.js";

/**
 *
 * @param str
 * @returns 只含有数字的字符串
 */
export function onlyNumber(str: string) {
  return str.trim().replace(/\D/g, "");
}

export function formatCardNo(str: string) {
  const newString = onlyNumber(str);
  // 使用正则表达式将连续的4个数字替换为带空格的格式
  const spacedNumber = newString.replace(/(\d{4})(?=\S)/g, "$1 ");

  // 返回处理后的字符串，去除首尾可能存在的空格
  return spacedNumber;
}

const defaultOptions = {
  precision: 2,
  append: "",
};

/**
 * 根据给定的数值和选项（小数精度与附加字符串）来格式化数值。
 * @param amount 要格式化的数值，可以是数字或数字形式的字符串。
 * @param options 可选的配置对象，包括小数精度（precision）和附加字符串（append）。
 * @returns 格式化后的数值字符串。
 */
export function cryptoPrecisionFormat(
  amount?: string | number,
  options?: Partial<{ append: string; precision: number }>,
) {
  const _options = Object.assign({}, defaultOptions, options);

  if (amount === undefined)
    return "--" + (_options.append ? ` ${_options.append}` : "");
  // 验证 `amount` 是否为有效的数值
  if (typeof amount === "string" && !isNaN(+amount)) {
    amount = +amount;
  }

  if (typeof amount !== "number" || isNaN(amount)) {
    throw new Error("Invalid input: amount must be a valid number.");
  }

  const formattedAmount = currency(amount, {
    precision: _options.precision,
    symbol: "",
  });

  // 返回格式化后的数值字符串
  return (
    formattedAmount.format() + (_options.append ? ` ${_options.append}` : "")
  );
}

export function currencyFormat(
  amount?: number | string,
  options?: currency.Options,
) {
  if (typeof amount === "string" || typeof amount === "number") {
    return currency(amount, options).format();
  }
  return " -- ";
}
