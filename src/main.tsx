<<<<<<< HEAD
// v4 — sarees & kurtis
=======
>>>>>>> 33e34ecccfadbe883a95e5eadb5e30279ace7d15
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { StoreProvider } from "./context/StoreContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>,
);
