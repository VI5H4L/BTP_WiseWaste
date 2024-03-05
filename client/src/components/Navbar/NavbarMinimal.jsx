import { useState } from 'react';
import { Center, Tooltip, UnstyledButton, Stack, rem } from '@mantine/core';
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
} from '@tabler/icons-react';
// import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './NavbarMinimal.module.css';

function NavbarLink({ icon: Icon, label, active, onClick }) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 100,transition:'fade' }}>
      <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: 'Home' ,goto:"/"},
  { icon: IconGauge, label: 'Dashboard' ,goto:"/dash"},
  { icon: IconDeviceDesktopAnalytics, label: 'Analytics' ,goto:"/analy"},
  { icon: IconCalendarStats, label: 'Releases' ,goto:"/rele"},
  { icon: IconUser, label: 'Account' ,goto:"/accont"},
  { icon: IconFingerprint, label: 'Security' ,goto:"/security"},
  { icon: IconSettings, label: 'Settings' ,goto:"/settin"},
];

export function NavbarMinimal() {
  const [active, setActive] = useState(0);

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <Center>
        <div className={classes.imgDiv}>
          <img  src="/images/logo1.png" alt="logo" />
        </div>
        
        {/* <MantineLogo type="mark" size={30} /> */}
      </Center>

      <div className={classes.navbarMain}>
        <Stack align='flex-start' justify="center" gap={4}>
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