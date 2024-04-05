import { useState, useEffect } from "react";
import { Center, Tooltip, UnstyledButton, Stack, rem } from "@mantine/core";
import {
  IconHome2,
  IconDeviceDesktopAnalytics,
  IconMap,
  IconUsersGroup,
  IconUser,
  IconLogout,
  IconReport,
  IconMessageReport,
  // IconSwitchHorizontal,
} from "@tabler/icons-react";
import classes from "./Navbar.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isNetworkErrorState, userDataState } from "../../Recoil/recoil_state";
import { Modal, Button } from "@mantine/core";

import { useRecoilState ,useSetRecoilState} from "recoil";
import { roleState } from "../../Recoil/recoil_state";

export function Navbar() {
  const location =useLocation();

  const [role, setRole] = useRecoilState(roleState);
  // const setToken = useSetRecoilState(tokenState);
  const setUserData = useSetRecoilState(userDataState);

  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [active, setActive] = useState("");

  useEffect(() => {
    setActive(location.pathname);
  }, [location]);

  const handleLoginBtn = () => {
    if (localStorage.getItem("role")) {
      setModalOpen(true);
    } else {
      navigate("/login");
    }
  };
  const handleCancel = () => {
    setModalOpen(false);
  };
  const handleLogout = () => {
    if (localStorage.getItem("role")) {
      // localStorage.removeItem("userToken");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userID");
      localStorage.removeItem("fullData");
      localStorage.removeItem("role");
      setRole("user");
      // setToken("");
      setUserData({});
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

  const mockData = {
    user: [{ icon: IconHome2, label: "Home", goto: "/" }],
    admin: [
      { icon: IconHome2, label: "Home", goto: "/" },
      {
        icon: IconUsersGroup,
        label: "Zone Allocation",
        goto: "/admin/zone-allocation",
      },
      {
        icon: IconMap,
        label: "Manage Zones",
        goto: "/admin/manage-zones",
      },
      { icon: IconDeviceDesktopAnalytics, label: "Simulation", goto: "/admin/simulation" },
      { icon: IconReport, label: "Report Workers", goto: "/admin/report-workers" },
      { icon: IconUser, label: "Profile", goto: "/admin/profile" },
    ],
    worker: [
      { icon: IconHome2, label: "Home", goto: "/" },
      {
        icon: IconMessageReport,
        label: "Maintenance Requests",
        goto: "/worker/maintenance-request",
      },
      // { icon: IconCalendarStats, label: "Releases", goto: "/releases" },
      { icon: IconUser, label: "Profile", goto: "/worker/profile" },
      // { icon: IconSettings, label: "Settings", goto: "/settings" },
    ],
  };

  const [roleData, setRoleData] = useState(mockData["user"]);
  useEffect(() => {
    setRoleData(mockData[role]);
  }, [role]);

  const links = roleData.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={link.goto == active}
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
            active={("/login" == active)||("/register" == active)}
            label={localStorage.getItem("role") ? "Logout" : "Login"}
          />
        </Stack>
      </nav>
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Do you want to Logout?"
        size="md"
        centered
        zIndex={2000}
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
