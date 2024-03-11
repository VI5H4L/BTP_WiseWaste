import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./MantineCSS/styles.css";
import "@mantine/notifications/styles.css";
import "./index.css";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { Notifications } from "@mantine/notifications";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <BrowserRouter>
        <Notifications />
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);
