import { JSX } from "react";
import { Routes, Route } from "react-router";
import { routes, type Route as RouteConfig } from "./routes";

/**
 * Props for the App component
 */
interface AppProps {
  initialData?: Record<string, unknown> | null;
}

/**
 * Main App component with routing
 */
function App({ initialData = {} }: AppProps): JSX.Element {
  return (
    <div className="app">
      {/*     <Header /> */}
      <main className="main-content">
        <Routes>
          {routes.map(({ path, component: Component }: RouteConfig) => (
            <Route
              key={path}
              path={path}
              element={<Component initialData={initialData} />}
            />
          ))}
        </Routes>
      </main>
    </div>
  );
}

export default App;
