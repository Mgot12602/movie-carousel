import { ComponentType } from "react";
import Home from "@/pages/Home";
import Details from "@/pages/Details";
import Wishlisted from "@/pages/Wishlisted";

export interface Route {
  path: string;
  component: ComponentType<Record<string, unknown>>;
}

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
    component: Wishlisted,
  },
];
