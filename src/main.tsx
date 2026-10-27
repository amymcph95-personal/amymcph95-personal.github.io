import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const root = document.getElementById("root") as HTMLElement;
const tree = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Prerendered pages ship real HTML (for crawlers); hydrate them instead of re-rendering.
// Only hydrate when the HTML was rendered for this exact URL. Hosts that fall back to
// another page's HTML (e.g. an unknown URL served the home page) would otherwise
// cause a hydration mismatch, so those are rendered fresh on the client instead.
const path = window.location.pathname.replace(/\/+$/, "") || "/";
if (root.hasChildNodes() && root.dataset.prerendered === "true" && root.dataset.route === path) {
  ReactDOM.hydrateRoot(root, tree);
} else {
  root.innerHTML = "";
  ReactDOM.createRoot(root).render(tree);
}
