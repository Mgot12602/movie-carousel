import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";
import { fetchComponentData } from "./server/utils/fetchComponentData.js";
import { routes, type Route } from "./routes.js";

/**
 * Server-side rendering result
 */
export interface RenderResult {
  html: string;
  initialData: any;
}

/**
 * Extract path from URL (remove query parameters)
 */
function getPathFromUrl(url: string): string {
  return url.split("?")[0];
}

/**
 * Get initial data for server-side rendering
 */
async function getInitialData(url: string): Promise<any> {
  try {
    const path = getPathFromUrl(url);
    console.log("url", url);
    const match = routes.find((r: Route) => r.path === path);
    if (!match) {
      return null;
    }
    const Component = match ? match.component : null;
    return fetchComponentData(Component);
  } catch (error) {
    console.error(`Component data fetching error:`, error);
    return null;
  }
}

/**
 * Render the React app to HTML string with initial data
 */
export async function render(url: string): Promise<RenderResult> {
  const initialData = await getInitialData(url);
  const html = renderToString(
    <StaticRouter location={url}>
      <App initialData={initialData} />
    </StaticRouter>
  );

  return { html, initialData };
}
