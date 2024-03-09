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

import classes from "./Login.module.css";
import {useBackButton} from "../../customHooks/useBackButton"
import { useNavigate } from "react-router-dom";

export function Login() {
  useBackButton("/");

  const navigate = useNavigate();
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={mobile?16:24}>
        <Title order={2} className={classes.title} ta="center" mt={50} mb={50}>
          {`Login to Wise Waste!!`}
        </Title>

        <TextInput
          label="Email address"
          placeholder="hello@gmail.com"
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
        <Checkbox label="Keep me logged in" color="#C9C9C9" variant="outline" mt="xl" size="md" />
        <Button id={classes.btn} fullWidth mt="xl" size="md">
          Login
        </Button>

        <Text ta="center" mt="md" mb={15}>
          Don&apos;t have an account?{" "}
          <a
            // fw={700}
            className={classes.register}
            onClick={(event) => {navigate('/register', { replace: false}); event.preventDefault();}}
          >
            Register
          </a>
        </Text>
      </Paper>
    </div>
  );
}
