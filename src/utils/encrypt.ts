export const encryptEmail = (email: string): string => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailRegex.test(email)) {
    const username = email.split("@")[0];
    const encryptedUsername =
      username.length > 4
        ? username.slice(0, 2) + "****" + username.slice(-2)
        : username.slice(0, 1) + "****" + username.slice(-1);
    return `${encryptedUsername}@${email.split("@")[1]}`;
  } else {
    return "";
  }
};

export const encryptStr = (
  str: string,
  prefix: number = 4,
  suffix: number = 4,
  replacer: string = "········",
): string => {
  if (
    prefix < 1 ||
    suffix < 1 ||
    !Number.isInteger(prefix) ||
    !Number.isInteger(suffix)
  ) {
    throw new Error("Prefix and suffix must be positive integers.");
  }

  const pattern = `^(.{${prefix}}).*(.{${suffix}})`; // 使用模板字符串构建正则表达式
  const regex = new RegExp(pattern, "g");
  return str.toString().replace(regex, `$1${replacer}$2`);
};

export const encryptCardNo = (cardNo?: string): string => {
  if (!cardNo) return `**** **** **** ****`;
  let suffix;
  if (cardNo.length < 4) {
    suffix = "****";
  } else {
    suffix = cardNo.slice(-4);
  }
  return `**** **** **** ${suffix}`;
};
