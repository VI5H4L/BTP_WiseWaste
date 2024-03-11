import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Network } from "@capacitor/network";
import { Navbar } from "./components/Navbar/Navbar";
import { setupIonicReact } from "@ionic/react";
import { Routes, Route } from "react-router-dom";
import classes from "./Layouts/AppLayout.module.css";
import { Dashboard } from "./components/Dashboard";
import { Analytics } from "./components/Analytics";
import { Error } from "./components/Error";
import { StatusBar } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { App as CapacitorApp } from "@capacitor/app";
import { NetworkError } from "./components/NetworkError";
import AppUrlListener from "./Listeners/AppUrlListener";
import { Register } from "./components/Register/Register";
import { Home } from "./components/Home/Home";
import { Login } from "./components/Login/Login";

import { useRecoilState } from "recoil";
import { isNetworkErrorState } from "./Recoil/recoil_state";

setupIonicReact();
Capacitor.isNativePlatform() &&
  StatusBar.setBackgroundColor({ color: "#1F1F1F" });

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [appUrl, setAppUrl] = useState("/");
  const [isNetworkError, setIsNetworkError] = useRecoilState(isNetworkErrorState);

  Capacitor.isNativePlatform() && ScreenOrientation.lock({ orientation: 'portrait' })
  .then(() => console.log('Locked screen orientation to portrait'))
  .catch((error) => console.error('Failed to lock screen orientation', error));
  
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
  }, [navigate, location.pathname, appUrl,setIsNetworkError]);

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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<Error />} />
          </Routes>
        )}
      </div>
    </div>
  );
}

export default App;
