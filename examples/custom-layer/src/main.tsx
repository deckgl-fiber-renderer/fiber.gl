import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Page from "./page";
// MAKE SURE TO IMPORT THIS
import "./_side-effects";
import "maplibre-gl/dist/maplibre-gl.css";
import "./_global.css";

// Create a client
const queryClient = new QueryClient();

createRoot(document.querySelector("#root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={null}>
        <Page />
      </Suspense>
    </QueryClientProvider>
  </StrictMode>
);
