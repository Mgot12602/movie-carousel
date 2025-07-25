import fs from "node:fs/promises";
import express from "express";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import dotenv from "dotenv";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;

let templateHtml = "";

if (isProduction) {
  templateHtml = await fs.readFile("./dist/client/index.html", "utf-8");
}

const app = express();

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

app.use("/{*any}", async (req, res) => {
  try {
    const url = req.originalUrl;

    let template;
    let render;

    if (!isProduction && vite) {
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      const module = await vite.ssrLoadModule("/src/server-entry.tsx");
      render = module.render;
    } else {
      template = templateHtml;
      const module = await import("./server-entry.js");
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

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
