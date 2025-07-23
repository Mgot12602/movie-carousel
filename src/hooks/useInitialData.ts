import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const useInitialData = <T extends Record<string, unknown>>(initialData?: T) => {
  const location = useLocation();
  const currentUrl = location.pathname + location.search;

  const [initialDataState, setInitialDataState] = useState<T | null>(
    initialData || null
  );
  const fetchData = async (currentUrl: string) => {
    try {
      const response = await fetch(currentUrl);
      const htmlText = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");
      const dataTag = doc.getElementById("__SSR_DATA__");

      if (dataTag && dataTag.textContent) {
        const ssrData = JSON.parse(dataTag.textContent) as T;

        if (ssrData) {
          setInitialDataState(ssrData);
        }
      } else {
        console.error("No __SSR_DATA__ found in response HTML");
      }
    } catch (error) {
      console.error("Error extracting data from HTML:", error);
    }
  };

  useEffect(() => {
    fetchData(currentUrl);
  }, [currentUrl]);

  return { initialDataState };
};

export default useInitialData;
