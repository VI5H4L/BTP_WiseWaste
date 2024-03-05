import { AuthenticationImage } from "./components/Login/AuthenticationImage";
import { NavbarMinimal } from "./components/Navbar/NavbarMinimal";
import { setupIonicReact } from "@ionic/react";
import { Routes, Route } from "react-router-dom";
import classes from "./Layouts/AppLayout.module.css";
import { Dashboard } from "./components/Dashboard";
import { Analytics } from "./components/Analytics";
import { StatusBar } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";

setupIonicReact();
Capacitor.isNativePlatform() &&
  StatusBar.setBackgroundColor({ color: "#1F1F1F" });

function App() {
  return (
    <div className={classes.appDiv}>
      <div className={classes.navDiv}>
        <NavbarMinimal />
      </div>
      <div className={classes.routeDiv}>
        <Routes>
          <Route path="/" element={<AuthenticationImage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
