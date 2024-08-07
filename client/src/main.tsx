import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { persist, store } from "./redux/store.ts";
import { Provider } from "react-redux";
import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import ThemeProvider from "./components/navbar/ThemeProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <PersistGate persistor={persist}>
    <Provider store={store}>
      <React.StrictMode>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </React.StrictMode>
    </Provider>
  </PersistGate>
);
