import { useEffect, useState } from "react";
import { useLocation } from "react-router";

/**
 * Hook to handle initial data fetching and state management
 * @template T - Type of the initial data
 */
const useInitialData = <T extends Record<string, unknown>>(initialData?: T) => {
  const location = useLocation();
  const currentUrl = location.pathname + location.search;
  console.log("currentUrl", currentUrl);

  // Use the generic type for state
  const [initialDataState, setInitialDataState] = useState<T | null>(
    initialData || null
  );
  const fetchData = async (currentUrl: string) => {
    console.log("Fetching data on client side");
    try {
      // Fetch the HTML from the current URL
      const response = await fetch(currentUrl);
      const htmlText = await response.text(); // Get response as text, not JSON

      // Extract data from the __SSR_DATA__ script tag in the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");
      const dataTag = doc.getElementById("__SSR_DATA__");

      if (dataTag && dataTag.textContent) {
        // Parse the JSON from the script tag and cast to the generic type
        const ssrData = JSON.parse(dataTag.textContent) as T;
        console.log("SSR data extracted from HTML response:", ssrData);

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
    console.log("initialData in useInitial", initialData);
    fetchData(currentUrl);
  }, [currentUrl]);

  // Type the return value using the generic type
  return { initialDataState };
};

export default useInitialData;
