import { AuthenticationImage } from "./components/Login/AuthenticationImage";
import { NavbarMinimal } from "./components/Navbar/NavbarMinimal";
import { setupIonicReact } from "@ionic/react";
import { Routes, Route } from "react-router-dom";
import "@mantine/core/styles.css";
import { Dashboard } from "./components/Dashboard";
import { Analytics } from "./components/Analytics";

setupIonicReact();

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
