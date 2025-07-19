import express from "express";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3e3;
async function createServer() {
  const app = express();
  let vite;
  if (!isProduction) {
    const { createServer: createServer2 } = await import("vite");
    vite = await createServer2({
      server: { middlewareMode: true },
      appType: "custom"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(resolve(__dirname, "dist/client")));
  }
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template;
      let render;
      if (!isProduction && vite) {
        const fs = await import("fs/promises");
        const rawTemplate = await fs.readFile(
          resolve(__dirname, "../index.html"),
          "utf-8"
        );
        template = await vite.transformIndexHtml(url, rawTemplate);
        const module = await vite.ssrLoadModule("/src/server-entry.tsx");
        render = module.render;
      } else {
        const fs = await import("fs/promises");
        template = await fs.readFile(
          resolve(__dirname, "../client/index.html"),
          "utf-8"
        );
        const module = await import("./assets/server-entry-ENYy-mal.js");
        render = module.render;
      }
      const { html: appHtml, initialData } = await render(url);
      const html = template.replace("<!--ssr-head-->", "").replace("<!--ssr-html-->", appHtml).replace(
        "<!--ssr-data-->",
        `<script id="__SSR_DATA__" type="application/json">${JSON.stringify(
          initialData
        )}<\/script>`
      );
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      if (!isProduction && vite) {
        vite.ssrFixStacktrace(e);
      }
      console.error("SSR Error:", e);
      next(e);
    }
  });
  return app;
}
createServer().then((app) => {
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
}).catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
