import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Network } from "@capacitor/network";
import { Navbar } from "./components/Navbar/Navbar";
import { setupIonicReact } from "@ionic/react";
import { Routes, Route } from "react-router-dom";
import classes from "./Layouts/AppLayout.module.css";
import { Analytics } from "./components/Analytics";
import { ZoneAllocation } from "./components/ZoneAllocation/ZoneAllocation";
import { Error } from "./components/Error";
import { StatusBar } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { App as CapacitorApp } from "@capacitor/app";
import { NetworkError } from "./components/NetworkError/NetworkError";
import AppUrlListener from "./Listeners/AppUrlListener";
import { Register } from "./components/Register/Register";
import { Home } from "./components/Home/Home";
import { Login } from "./components/Login/Login";

import { useRecoilState } from "recoil";
import { isNetworkErrorState } from "./Recoil/recoil_state";

import OneSignal from "onesignal-cordova-plugin";

import { AnimatePresence } from "framer-motion";
import ManageZones from "./components/ManageZones/ManageZones";

setupIonicReact();
Capacitor.isNativePlatform() &&
  StatusBar.setBackgroundColor({ color: "#1F1F1F" });

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [appUrl, setAppUrl] = useState("/");
  const [isNetworkError, setIsNetworkError] =
    useRecoilState(isNetworkErrorState);

  Capacitor.isNativePlatform() &&
    ScreenOrientation.lock({ orientation: "portrait" })
      .then(() => console.log("Locked screen orientation to portrait"))
      .catch((error) =>
        console.error("Failed to lock screen orientation", error)
      );

  useEffect(() => {
    // Save the current route when the app goes to the background
    CapacitorApp.addListener("appStateChange", (state) => {
      if (!state.isActive) {
        setAppUrl(location.pathname);
      }
    });

    // Restore the route when the app comes back to the foreground
    CapacitorApp.addListener("appRestoredResult", () => {
      navigate(appUrl);
    });

    Network.addListener("networkStatusChange", async (status) => {
      setIsNetworkError(!status.connected);
    });

    const checkCurrentNetworkStatus = async () => {
      const status = await Network.getStatus();
      setIsNetworkError(!status.connected);
    };
    checkCurrentNetworkStatus();
  }, [navigate, location.pathname, appUrl, setIsNetworkError]);

  useEffect(() => {
    const setupPushNotifications = async () => {
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
    };

    Capacitor.isNativePlatform() && setupPushNotifications();
  }, []);

  return (
    <div className={classes.appDiv}>
      <AppUrlListener />
      <div className={classes.navDiv}>
        <Navbar />
      </div>
      <div className={classes.routeDiv}>
        {isNetworkError ? (
          <NetworkError />
        ) : (
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/admin/zoneallocation" element={<ZoneAllocation />} />
              <Route path="/admin/managezones" element={<ManageZones />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default App;
