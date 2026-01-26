import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store, persistor } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

// When deployed, Vite exposes `import.meta.env.VITE_API_URL`.
// If set, rewrite relative `/api` and `/uploads` fetch requests to that base.
;(function installApiPrefix() {
  const base = import.meta.env.VITE_API_URL || '';
  if (!base) return;
  const origFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    try {
      if (typeof input === 'string') {
        if (input.startsWith('/api') || input.startsWith('/uploads')) {
          input = base.replace(/\/+$/, '') + input;
        }
      } else if (input && input.url && typeof input.url === 'string') {
        if (input.url.startsWith('/api') || input.url.startsWith('/uploads')) {
          const newUrl = base.replace(/\/+$/, '') + input.url;
          input = new Request(newUrl, input);
        }
      }
    } catch (e) {
      // ignore and fallback to original input
    }
    return origFetch(input, init);
  };
})();