import React from "react";
import ReactDOM from "react-dom/client";
import App from "../src/components/App/App";
import "normalize.css/normalize.css";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "modern-normalize/modern-normalize.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
