import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import { App } from "./app";
import { monitoring } from "./lib/monitoring";
import { analytics } from "./lib/analytics";

// Initialize monitoring and analytics globally at application startup
monitoring.init();
analytics.init();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Application entry point configured
