import {
  Paper,
  TextInput,
  PasswordInput,
  // Checkbox,
  Button,
  Title,
  Text,
  useMantineTheme
  // Anchor,
} from "@mantine/core";
import { useMediaQuery } from '@mantine/hooks';
import classes from "./Register.module.css";
import {useBackButton} from "../../customHooks/useBackButton"
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function Register() {
  useBackButton("/login");

  const navigate = useNavigate();
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const [isOTP,setIsOTP] = useState(false);

  const handleRegister = ()=>{
    setIsOTP(true);
  }
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={mobile?16:24}>
        <Title order={2} className={classes.title} ta="center" mt={50} mb={50}>
          {`Join Wise Waste Initiative ->`}
        </Title>

        <TextInput
          label="Full Name"
          placeholder="Abc Xyz"
          size="md"
          required
          error={""}
          disabled ={isOTP}
        />

        <TextInput
          label="Email address"
          placeholder="hello@gmail.com"
          mt="md"
          size="md"
          required
          disabled ={isOTP}
          // error={""}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          mt="md"
          size="md"
          required
          disabled ={isOTP}
          // error={""}
        />
        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm your password"
          mt="md"
          size="md"
          required
          disabled ={isOTP}
          // error={""}
        />
        <TextInput
          label="OTP"
          placeholder="Enter 4-digit OTP"
          mt="md"
          size="md"
          required
          error={""}
          disabled ={!isOTP}
        />
        <Button id={classes.btn} onClick={handleRegister} fullWidth mt="xl" size="md">
          {!isOTP?"Next":"Register"}
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
