import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./index.css";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <BrowserRouter>
        <RecoilRoot>
          <QueryClientProvider client={queryClient}>
            <Notifications zIndex={2000}/>
            <App />
          </QueryClientProvider>
        </RecoilRoot>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);