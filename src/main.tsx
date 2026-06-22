import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App";
import { initSentry } from "./lib/sentry";
import "./index.css";

initSentry();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary
      fallback={
        <p className="p-8 text-center text-white">Something went wrong.</p>
      }
    >
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
