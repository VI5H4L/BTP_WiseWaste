import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Network } from "@capacitor/network";
import { Navbar } from "./pages/Navbar/Navbar";
import { setupIonicReact } from "@ionic/react";
import { Routes, Route } from "react-router-dom";
import classes from "./Layouts/AppLayout.module.css";
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

import { useRecoilState, useSetRecoilState } from "recoil";
import {
  isNetworkErrorState,
  roleState,
  userDataState,
} from "./Recoil/recoil_state";

import OneSignal from "onesignal-cordova-plugin";

import { AnimatePresence } from "framer-motion";
import ManageZones from "./pages/Admin/ManageZones/ManageZones";

import PrivateRoute from "./PrivateRoute";
import Simulation from "./pages/Admin/Simulation/Simulation";
import WorkerProfile from "./pages/Worker/WorkerProfile/WorkerProfile";
import AdminProfile from "./pages/Admin/AdminProfile/AdminProfile";
import ReportWorkers from "./pages/Admin/ReportWorkers/ReportWorkers";
import MaintenanceRequest from "./pages/Worker/MaintenanceRequest/MaintenanceRequest";

setupIonicReact();

const setupPushNotifications = () => {
  // Remove this method to stop OneSignal Debugging
  OneSignal.Debug.setLogLevel(6);

  // Replace YOUR_ONESIGNAL_APP_ID with your OneSignal App ID
  OneSignal.initialize("eaf15ef2-339a-41e1-9ce8-c699cca65862");

  OneSignal.Notifications.addEventListener("click", async (e) => {
    let clickData = await e.notification;
    console.log("Notification Clicked : " + clickData);
  });

  OneSignal.Notifications.requestPermission(true).then((success) => {
    console.log("Notification permission granted " + success);
  });
};

Capacitor.isNativePlatform() && setupPushNotifications();

Capacitor.isNativePlatform() &&
  StatusBar.setBackgroundColor({ color: "#1F1F1F" });

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [appUrl, setAppUrl] = useState("/");
  const [isNetworkError, setIsNetworkError] =
    useRecoilState(isNetworkErrorState);

  const setRole = useSetRecoilState(roleState);
  // const setToken = useSetRecoilState(tokenState);
  const setUserData = useSetRecoilState(userDataState);

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
    if (localStorage.getItem("role") != undefined) {
      setRole(localStorage.getItem("role"));
    }
    // if (localStorage.getItem("userToken") != undefined) {
    //   setToken(localStorage.getItem("userToken"));
    // }
    if (localStorage.getItem("fullData") != undefined) {
      setUserData(localStorage.getItem("fullData"));
    }
  }, [setRole, setUserData]);

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
              <Route
                path="/worker/profile"
                element={
                  <PrivateRoute roles={["worker"]}>
                    <WorkerProfile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/worker/maintenance-request"
                element={
                  <PrivateRoute roles={["worker"]}>
                    <MaintenanceRequest />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/zone-allocation"
                element={
                  <PrivateRoute roles={["admin"]}>
                    <ZoneAllocation />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/manage-zones"
                element={
                  <PrivateRoute roles={["admin"]}>
                    <ManageZones />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/simulation"
                element={
                  <PrivateRoute roles={["admin"]}>
                    <Simulation />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/report-workers"
                element={
                  <PrivateRoute roles={["admin"]}>
                    <ReportWorkers />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/profile"
                element={
                  <PrivateRoute roles={["admin"]}>
                    <AdminProfile />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Error />} />
            </Routes>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default App;
