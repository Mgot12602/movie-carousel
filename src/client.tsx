import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/main.scss";

const dataTag = document.getElementById("__SSR_DATA__");
const initialData: Record<string, unknown> = dataTag
  ? JSON.parse(dataTag.textContent || "{}")
  : {};

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

hydrateRoot(
  rootElement,
  <BrowserRouter>
    <App initialData={initialData} />
  </BrowserRouter>
);
