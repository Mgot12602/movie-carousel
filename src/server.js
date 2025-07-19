import fs from "node:fs/promises";
import express from "express";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import dotenv from "dotenv";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile("./dist/client/index.html", "utf-8")
  : "";

// Create http server
const app = express();

// Add Vite or respective production middlewares
let vite;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(resolve(__dirname, "dist/client")));
}

// Serve HTML
app.use("/{*any}", async (req, res, next) => {
  try {
    console.log("req.originalUrl", req.originalUrl);
    const url = req.originalUrl;

    let template;
    let render;

    if (!isProduction && vite) {
      // Always read fresh template in development
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      const module = await vite.ssrLoadModule("/src/server-entry.tsx");
      render = module.render;
    } else {
      template = templateHtml;
      const module = await import("./dist/server/server-entry.js");
      render = module.render;
    }

    const rendered = await render(url);

    const html = template
      .replace(`<!--ssr-head-->`, rendered.head ?? "")
      .replace(`<!--ssr-html-->`, rendered.html ?? "")
      .replace(
        `<!--ssr-data-->`,
        `${JSON.stringify(rendered.initialData ?? {})}`
      );

    res.status(200).set({ "Content-Type": "text/html" }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
