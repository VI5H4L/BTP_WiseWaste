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
  IconSwitchHorizontal,
} from "@tabler/icons-react";
// import { MantineLogo } from '@mantinex/mantine-logo';
import classes from "./NavbarMinimal.module.css";
import { Link, useNavigate } from "react-router-dom";


export function NavbarMinimal() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  function NavbarLink({ icon: Icon, label, goto, active, onPress }) {
    return (
      <div onClick={() => {navigate(goto)}}>
        <Tooltip
          label={label}
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
    { icon: IconGauge, label: "Dashboard", goto: "/dashboard" },
    { icon: IconDeviceDesktopAnalytics, label: "Analytics", goto: "/analytics" },
    { icon: IconCalendarStats, label: "Releases", goto: "/releases" },
    { icon: IconUser, label: "Account", goto: "/account" },
    { icon: IconFingerprint, label: "Security", goto: "/security" },
    { icon: IconSettings, label: "Settings", goto: "/settings" },
  ];

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onPress={() => setActive(index)}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <Center>
        <div className={classes.imgDiv}>
            <img onClick={() => {navigate("/")}} src="/images/logo1.png" alt="logo" />
        </div>

        {/* <MantineLogo type="mark" size={30} /> */}
      </Center>

      <div className={classes.navbarMain}>
        <Stack align="flex-start" justify="center" gap={4}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink icon={IconSwitchHorizontal} label="Change account" />
        <NavbarLink icon={IconLogout} label="Logout" />
      </Stack>
    </nav>
  );
}
