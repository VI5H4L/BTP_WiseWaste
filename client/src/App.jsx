import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Network } from "@capacitor/network";
import { Navbar } from "./pages/Navbar/Navbar";
import { setupIonicReact } from "@ionic/react";
import { Routes, Route } from "react-router-dom";
import classes from "./Layouts/AppLayout.module.css";
import { Analytics } from "./pages/Analytics";
import { ZoneAllocation } from "./pages/Admin/ZoneAllocation/ZoneAllocation";
import { Error } from "./pages/Error";
import { StatusBar } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { App as CapacitorApp } from "@capacitor/app";
import { NetworkError } from "./pages/NetworkError/NetworkError";
import AppUrlListener from "./Listeners/AppUrlListener";
import { Register } from "./pages/Register/Register";
import { Home } from "./pages/Home/Home";
import { Login } from "./pages/Login/Login";

import { useRecoilState } from "recoil";
import { isNetworkErrorState, roleState,tokenState,userDataState } from "./Recoil/recoil_state";

import OneSignal from "onesignal-cordova-plugin";

import { AnimatePresence } from "framer-motion";
import ManageZones from "./pages/Admin/ManageZones/ManageZones";


setupIonicReact();
Capacitor.isNativePlatform() &&
  StatusBar.setBackgroundColor({ color: "#1F1F1F" });

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [appUrl, setAppUrl] = useState("/");
  const [isNetworkError, setIsNetworkError] =
    useRecoilState(isNetworkErrorState);

  const [role,setRole] = useRecoilState(roleState);
  const [token,setToken] = useRecoilState(tokenState);
  const [userData,setUserData] = useRecoilState(userDataState);

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

  useEffect(() => {
    if(localStorage.getItem("role")!=undefined){
      setRole(localStorage.getItem("role"));
    }
    if(localStorage.getItem("userToken")!=undefined){
      setToken(localStorage.getItem("userToken"));
    }
    if(localStorage.getItem("fullData")!=undefined){
      setUserData(localStorage.getItem("fullData"));
    }
  }, [setRole,setToken,setUserData]);

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
              <Route
                path="/admin/zoneallocation"
                element={<ZoneAllocation />}
              />
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
