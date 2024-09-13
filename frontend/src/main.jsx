import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "./components/ui/sonner";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="loader"></div>
    <p className="ml-2">Loading...</p>
  </div>
);

// Add a basic loader in your CSS
// .loader {
//   border: 4px solid rgba(0, 0, 0, 0.1);
//   border-left-color: #22c55e;
//   border-radius: 50%;
//   width: 32px;
//   height: 32px;
//   animation: spin 1s linear infinite;
// }
//
// @keyframes spin {
//   100% {
//     transform: rotate(360deg);
//   }
// }

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <App />
      </PersistGate>
      <Toaster />
    </Provider>
  </React.StrictMode>
);
