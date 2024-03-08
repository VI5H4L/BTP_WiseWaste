import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Network } from "@capacitor/network";
import { Login } from "./components/Login/Login";
import { Navbar } from "./components/Navbar/Navbar";
import { setupIonicReact } from "@ionic/react";
import { Routes, Route } from "react-router-dom";
import classes from "./Layouts/AppLayout.module.css";
import { Dashboard } from "./components/Dashboard";
import { Analytics } from "./components/Analytics";
import { Error } from "./components/Error";
import { StatusBar } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";
import { NetworkError } from "./components/NetworkError";
import { Register } from "./components/Register/Register";
import { Home } from "./components/Home";

setupIonicReact();
Capacitor.isNativePlatform() &&
  StatusBar.setBackgroundColor({ color: "#1F1F1F" });

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    Network.addListener("networkStatusChange", async (status) => {
      console.log("Network status changed", status);
      if (status.connected == false) {
        navigate("/network");
      } else {
        navigate("/");
      }
    });

    // Call the function to check the network status inside the listener
    const checkCurrentNetworkStatus = async () => {
      const status = await Network.getStatus();
      if (status.connected == false) {
        navigate("/network");
      }
    };
    checkCurrentNetworkStatus();
  }, [navigate]);

  return (
    <div className={classes.appDiv}>
      <div className={classes.navDiv}>
        <Navbar />
      </div>
      <div className={classes.routeDiv}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/network" element={<NetworkError />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
