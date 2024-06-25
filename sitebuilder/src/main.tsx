import React from "react";
import ReactDOM from "react-dom/client";
import  App  from "./App.tsx";
import "./style.css";
import '@shoelace-style/shoelace/dist/themes/light.css';
import "@shoelace-style/shoelace/dist/themes/dark.css";
import "@shoelace-style/shoelace";
import "@shoelace-style/shoelace/dist/components/color-picker/color-picker";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";

// Set the base path to the folder we copied Shoelace's assets to
setBasePath("/static/");
// Background color is not exported

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);

