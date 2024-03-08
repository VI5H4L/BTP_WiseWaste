import {
  Paper,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  useMantineTheme
  // Anchor,
} from "@mantine/core";
import { useMediaQuery } from '@mantine/hooks';

import classes from "./Register.module.css";
import AppUrlListener from "../../Listeners/AppUrlListener"
import {useBackButton} from "../../customHooks/useBackButton"
import { useNavigate } from "react-router-dom";

export function Register() {
  useBackButton("exit");

  const navigate = useNavigate();
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  return (
    <div className={classes.wrapper}>
      <AppUrlListener />
      <Paper className={classes.form} radius={0} p={mobile?16:24}>
        <Title order={2} className={classes.title} ta="center" mt={50} mb={50}>
          Join the Wise Waste Initiative!
        </Title>

        <TextInput
          label="Full Name"
          placeholder="Abc Xyz"
          size="md"
          required
          error={""}
        />

        <TextInput
          label="Email address"
          placeholder="hello@gmail.com"
          mt="md"
          size="md"
          required
          // error={""}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          mt="md"
          size="md"
          required
          // error={""}
        />
        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm your password"
          mt="md"
          size="md"
          required
          // error={""}
        />
        <Button id={classes.btn} fullWidth mt="xl" size="md">
          Register
        </Button>

        <Text ta="center" mt="md">
          Have an account already?{" "}
          <a
            // fw={700}
            className={classes.register}
            onClick={(event) => {navigate('/login', { replace: false}); event.preventDefault();}}
          >
            Login
          </a>
        </Text>
      </Paper>
    </div>
  );
}
