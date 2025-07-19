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
          additionalData: `@import "@/styles/variables.scss";`,
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
    // Server build configuration
    config.build = {
      ssr: true,
      rollupOptions: {
        input: "src/server.ts", // Updated to TypeScript
        output: {
          format: "es",
        },
      },
    };
  } else {
    // Client build configuration
    config.build = {
      rollupOptions: {
        input: resolve(__dirname, "index.html"),
      },
    };
  }

  return config;
});
