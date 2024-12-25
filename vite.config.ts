import path from "path";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  if (mode === "lib") {
    return {
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "src"),
        },
      },
      build: {
        lib: {
          entry: "src/ex-app.ts",
          name: "index",
          fileName: "index",
          formats: ["es"],
        },
      },
    };
  }

  return {
    server: {
      host: "0.0.0.0",
      proxy: {
        "/api": {
          target: "http://card.exworth.local",
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
