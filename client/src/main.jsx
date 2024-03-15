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
import OneSignal from "onesignal-cordova-plugin";

// Remove this method to stop OneSignal Debugging
OneSignal.Debug.setLogLevel(6);

// Replace YOUR_ONESIGNAL_APP_ID with your OneSignal App ID
OneSignal.initialize("e2518251-69a3-42a7-9891-dcf1761d4efe");

OneSignal.Notifications.addEventListener("click", async (e) => {
  let clickData = await e.notification;
  console.log("Notification Clicked : " + clickData);
});

OneSignal.Notifications.requestPermission(true).then((success) => {
  console.log("Notification permission granted " + success);
});

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
