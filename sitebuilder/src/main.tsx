import React from "react";
import ReactDOM from "react-dom/client";
import  App  from "./App.tsx";
import "./style.css";
import '@shoelace-style/shoelace/dist/themes/light.css';
import "@shoelace-style/shoelace/dist/themes/dark.css";
import "@shoelace-style/shoelace";

// Background color is not exported

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);

