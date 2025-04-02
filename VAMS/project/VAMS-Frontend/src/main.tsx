import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import { VolcanoProvider } from "./utils/VolcanoContext";

const router = createBrowserRouter(routes);

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <VolcanoProvider>
        <RouterProvider router={router} />
      </VolcanoProvider>
    </StrictMode>
  );
} else {
  console.error("Root element not found");
}
