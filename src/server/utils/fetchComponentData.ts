import { ComponentType } from "react";

/**
 * Component with server-side data fetching capability
 */
type Component =
  | (ComponentType & {
      getServerSideData?: (url: string) => Promise<any>;
    })
  | null;

/**
 * Generic data fetcher - completely agnostic
 * Works with any component that has a getServerSideData method
 */
export async function fetchComponentData(
  Component: Component,
  url: string
): Promise<any> {
  if (Component?.getServerSideData) {
    try {
      return await Component.getServerSideData(url);
    } catch (error) {
      console.error(`Component data fetching error:`, error);
      return { error: "Failed to load data" };
    }
  }

  return {}; // No data needed
}
