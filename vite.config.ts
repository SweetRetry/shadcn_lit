import { readdirSync } from "fs";
import path from "path";
import { defineConfig } from "vite";

// 动态扫描指定目录下的文件
function getElementEntries(dir: string) {
  const files = readdirSync(dir); // 读取目录中的文件
  const entries: Record<string, string> = {};

  files.forEach((file) => {
    const name = path.parse(file).name; // 文件名（不含扩展名）
    const filePath = path.resolve(dir, file); // 文件完整路径
    entries[name] = filePath; // 将文件添加为入口
  });

  return entries;
}

export default defineConfig(({ mode }) => {
  if (mode === "elements") {
    return {
      build: {
        lib: {
          entry: getElementEntries("src/elements"), // 动态生成入口
          formats: ["es"], // 输出格式
        },
        rollupOptions: {
          output: {
            entryFileNames: "ex-libs/[name].js",
          },
        },
      },
    };
  }

  return {};
});
