import React from "react";
import { HashRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
// import './assets/css/index.css'
import "./assets/scss/main.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <App />
  </HashRouter>
);
