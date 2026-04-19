import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { applyM3Palette, generateM3Palette } from "./lib/theme";

const defaultPalette = generateM3Palette("#0f766e"); // Original accent as seed
applyM3Palette(defaultPalette);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
