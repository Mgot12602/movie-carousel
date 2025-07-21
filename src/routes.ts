import { ComponentType } from "react";
import Home from "@/pages/Home";
import Details from "@/pages/Details";

/**
 * Route configuration interface
 */
export interface Route {
  path: string;
  component: ComponentType<any>;
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
];
