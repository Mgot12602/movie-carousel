import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";
import { fetchComponentData } from "./server/utils/fetchComponentData";
import { routes, type Route } from "./routes";

export interface RenderResult {
  html: string;
  initialData: Record<string, unknown> | null;
}

function getPathFromUrl(url: string): string {
  return url.split("?")[0];
}

async function getInitialData(
  url: string
): Promise<Record<string, unknown> | null> {
  try {
    const path = getPathFromUrl(url);
    const match = routes.find((r: Route) => {
      return r.path === path;
    });
    if (!match) {
      return null;
    }

    const Component = match.component;
    return fetchComponentData(Component, url);
  } catch (error) {
    console.error(`Component data fetching error:`, error);
    return null;
  }
}

export async function render(url: string): Promise<RenderResult> {
  const initialData = await getInitialData(url);
  const html = renderToString(
    <StaticRouter location={url}>
      <App initialData={initialData} />
    </StaticRouter>
  );

  return { html, initialData };
}
