export function generateHSLShades(primaryColor: string): string {
  // 提取 HSL 值
  const [hue, saturation, lightness] = primaryColor
    .split(" ")
    .map((v) => parseFloat(v.replace("%", "")));

  // 定义各层级的亮度（可根据设计需求调整）
  const lightnessSteps = {
    50: lightness + 35, // 最亮
    100: lightness + 30,
    200: lightness + 20,
    300: lightness + 10,
    400: lightness,
    500: lightness - 10, // 主色
    600: lightness - 15,
    700: lightness - 20,
    800: lightness - 25,
    900: lightness - 30,
    950: lightness - 35, // 最暗
  };

  // 限制亮度在 0% 到 100% 范围内
  const clamp = (value: number) => Math.max(0, Math.min(100, value));

  // 生成 CSS 变量
  return Object.entries(lightnessSteps)
    .map(
      ([key, l]) =>
        `--sl-color-primary-${key}: hsl(${hue}, ${saturation}%, ${clamp(l)}%)!important;`
    )
    .join("\n");
}
