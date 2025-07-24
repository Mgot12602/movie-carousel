import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig(({ command, mode }) => {
  const isSSRBuild = mode === "production" && process.argv.includes("--ssr");

  const config: UserConfig = {
    plugins: [react()],
    esbuild: {
      loader: "tsx" as const,
      include: /src\/.*\.[jt]sx?$/,
      exclude: [],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variables.scss" as *;`,
        },
      },
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
  };

  if (isSSRBuild) {
    config.build = {
      ssr: true,
      rollupOptions: {
        input: "src/server.js",
        output: {
          format: "es",
        },
      },
    };
  } else {
    config.build = {
      rollupOptions: {
        input: resolve(__dirname, "index.html"),
      },
    };
  }

  return config;
});
