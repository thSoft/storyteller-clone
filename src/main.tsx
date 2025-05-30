import { StrictMode } from "react";
import * as ReactDOMClient from "react-dom/client";
import { Provider } from "react-redux";
import "react-tooltip/dist/react-tooltip.css";
import { PersistGate } from "redux-persist/integration/react";
import { App } from "./components/App";
import { persistor, store } from "./store/store";
import "./style.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOMClient.createRoot(rootElement);

  root.render(
    <StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </StrictMode>
  );
}
