import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { defaultSpec, validateAppFlowSpec } from "./lib/spec";

// Validar el spec al inicio
validateAppFlowSpec(defaultSpec);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
