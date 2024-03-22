import { useState } from "react";
import { Center, Tooltip, UnstyledButton, Stack, rem } from "@mantine/core";
import {
  IconHome2,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconCalendarStats,
  IconUser,
  IconSettings,
  IconLogout,
  // IconSwitchHorizontal,
} from "@tabler/icons-react";
// import { MantineLogo } from '@mantinex/mantine-logo';
import classes from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isNetworkErrorState } from "../../Recoil/recoil_state";
import { Modal, Button } from "@mantine/core";

export function Navbar() {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const handleLoginBtn = () => {
    if (localStorage.getItem("userToken")) {
      setModalOpen(true);
    } else {
      navigate("/login");
    }
  };
  const handleCancel = () => {
    setModalOpen(false);
  };
  const handleLogout = () => {
    if (localStorage.getItem("userToken")) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userID");
      localStorage.removeItem("fullData");
      localStorage.removeItem("role");
      setModalOpen(false);
      navigate("/login");
    }
  };

  function NavbarLink({ icon: Icon, label, goto, active, onPress }) {
    return (
      <div
        onClick={() => {
          if (goto == "/login") {
            handleLoginBtn();
          } else navigate(goto);
        }}
      >
        <Tooltip
          label={label}
          zIndex={1000}
          position="right"
          transitionProps={{ duration: 100, transition: "fade" }}
        >
          <UnstyledButton
            onClick={onPress}
            className={classes.link}
            data-active={active || undefined}
          >
            <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
          </UnstyledButton>
        </Tooltip>
      </div>
    );
  }

  const mockdata = [
    { icon: IconHome2, label: "Home", goto: "/" },
    { icon: IconGauge, label: "Zone Allocation", goto: "/admin/zoneallocation" },
    { icon: IconDeviceDesktopAnalytics,label: "Analytics",goto: "/analytics",},
    { icon: IconCalendarStats, label: "Releases", goto: "/releases" },
    { icon: IconUser, label: "Account", goto: "/account" },
    { icon: IconFingerprint, label: "Manage Zones", goto: "/admin/managezones" },
    { icon: IconSettings, label: "Settings", goto: "/settings" },
  ];
  // const adminmockdata = [
  //   { icon: IconHome2, label: "Home", goto: "/" },
  //   { icon: IconGauge, label: "Dashboard", goto: "/dashboard" },
  // ];

  // let mockdata;
  // const [role]=useState("admin");
  // if(role=="worker"){
  //   mockdata = workermockdata;
  // }
  // else if(role=="admin"){
  //   mockdata = adminmockdata;
  // }

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onPress={() => setActive(index)}
    />
  ));

  const isNetworkError = useRecoilValue(isNetworkErrorState);

  return (
    <>
      <nav
        className={classes.navbar}
        style={{
          pointerEvents: isNetworkError && "none",
          filter: isNetworkError && "grayscale(1)",
        }}
      >
        <Center>
          <div className={classes.imgDiv}>
            <img
              onClick={() => {
                navigate("/");
              }}
              src="/images/logo1.png"
              alt="logo"
            />
          </div>
        </Center>

        <div className={classes.navbarMain}>
          <Stack align="flex-start" justify="center" gap={4}>
            {links}
          </Stack>
        </div>

        <Stack justify="center" gap={0}>
          <NavbarLink
            icon={IconLogout}
            goto={"/login"}
            label={localStorage.getItem("userToken") ? "Logout" : "Login"}
          />
        </Stack>
      </nav>
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Do you want to Logout?"
        size="md"
        centered
      >
        <div>
          <Button
            color="var(--mantine-color-red-7)"
            fullWidth
            size="md"
            variant="filled"
            style={{ marginBottom: "10px" }} // Add space between buttons
            onClick={handleLogout}
          >
            Yes, Logout
          </Button>

          <Button
            color="#C9C9C9"
            fullWidth
            size="md"
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}
