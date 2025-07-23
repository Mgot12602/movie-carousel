import { ComponentType } from "react";
import Home from "@/pages/Home";
import Details from "@/pages/Details";
import Whishlisted from "./pages/Whishlisted";

/**
 * Route configuration interface
 */
export interface Route {
  path: string;
  component: ComponentType<Record<string, unknown>>;
}

/**
 * Application routes configuration
 */
export const routes: Route[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/details",
    component: Details,
  },
  {
    path: "/wishlisted",
    component: Whishlisted,
  },
];
