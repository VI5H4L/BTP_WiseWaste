import { AuthenticationImage } from "./components/Login/AuthenticationImage";
import { NavbarMinimal } from "./components/Navbar/NavbarMinimal";
import { setupIonicReact } from "@ionic/react";
import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { Analytics } from "./components/Analytics";
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from "@capacitor/core";

setupIonicReact();
Capacitor.isNativePlatform() && StatusBar.setBackgroundColor({color:"#1F1F1F"});

function App() {
  return (
    <>
      <NavbarMinimal />
      <Routes>
        <Route path="/" element={<AuthenticationImage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </>
  );
}

export default App;
