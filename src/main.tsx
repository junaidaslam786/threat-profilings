import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/smooth-transitions.css";
import App from "./App.tsx";
import store from "./Redux/store.ts";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "./config/aws-config";

// Only import debug utilities in development
if (process.env.NODE_ENV === 'development') {
  import("./utils/debugAuth"); // Add debug function to window
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
