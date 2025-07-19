import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/main.scss";

/**
 * Client-side hydration entry point
 */

// Get server-side rendered data from the DOM
const dataTag = document.getElementById("__SSR_DATA__");
const initialData: Record<string, any> = dataTag
  ? JSON.parse(dataTag.textContent || "{}")
  : {};

// Get the root element
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// Hydrate the React app
hydrateRoot(
  rootElement,
  <BrowserRouter>
    <App initialData={initialData} />
  </BrowserRouter>
);
