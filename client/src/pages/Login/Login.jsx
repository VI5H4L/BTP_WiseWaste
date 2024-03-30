import {
  Paper,
  TextInput,
  PasswordInput,
  Checkbox,
  Box,
  Button,
  Title,
  Text,
  useMantineTheme,
  // Anchor,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useForm, isEmail, hasLength } from "@mantine/form";
import classes from "./Login.module.css";
import { useBackButton } from "../../customHooks/useBackButton";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useState } from "react";
import Transition from "../../Transition";

import { useSetRecoilState } from "recoil";
import { roleState,userDataState } from "../../Recoil/recoil_state";



const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
export function Login() {
  useBackButton("/");

  const setRole = useSetRecoilState(roleState);
  const setUserData = useSetRecoilState(userDataState);

  const [btnLoading, setBtnLoading] = useState(false);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      logincheckbox: false,
    },

    validate: {
      email: isEmail("Enter valid email"),
      password: hasLength({ min: 8 }, "Password must be 8 characters long"),
    },
  });

  const navigate = useNavigate();
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const handleLogin = async (values) => {
    try {
      setBtnLoading(true);
      // console.log(values);
      const uri = `${BACKEND_URI}/authentication/login`;
      const response = await axios({
    method: 'post',
    url: uri,
    data: {
        emailID: values.email,
        password: values.password,
    },
    withCredentials: true
});
      console.log(response.data);

      if (response.data.success && response.data.user.adminVerified) {
        setBtnLoading(false);
        console.log("Success Login");
        notifications.show({
          title: "Logged In Successfully",
          message: "Speedy work on Progress..",
          color: "var(--mantine-secondary-color-body)",
          withBorder: "true",
        });

        localStorage.setItem(
          "userEmail",
          response.data.user.emailID
        );
        localStorage.setItem(
          "userName",
          response.data.user.fullName
        );
        localStorage.setItem("userID", response.data.user._id);
        localStorage.setItem("fullData", JSON.stringify(response.data));
        localStorage.setItem("role", response.data.role);
        setRole(response.data.role);
        // setToken(response.data.user.token);
        setUserData(JSON.stringify(response.data));

        navigate("/");
      } else if (
        !response.data.success &&
        response.data.message === "Invalid password entered!"
      ) {
        setBtnLoading(false);
        notifications.show({
          title: "Incorrect Password",
          message: "Please enter correct password..",
          color: "red",
          withBorder: "true",
        });
      } else {
        setBtnLoading(false);
        console.log("Failed Login");
        notifications.show({
          title: "Login Failed",
          message: "Please try again...",
          color: "red",
          withBorder: "true",
        });
      }
    } catch (error) {
      setBtnLoading(false);
      console.error(error.response.data);
      notifications.show({
        title: "Login Failed",
        message: "Please try again...",
        color: "red",
        withBorder: "true",
      });
    }
  };

  return (
    <Transition>
      <div className={classes.wrapper}>
        <Paper className={classes.form} radius={0} p={mobile ? 16 : 24}>
          <Box
            mt={56}
            component="form"
            onSubmit={form.onSubmit((values) => {
              handleLogin(values);
            })}
          >
            <Title
              order={mobile ? 3 : 2}
              className={classes.title}
              ta="center"
              mt={mobile ? 16 : 24}
              mb={mobile ? 32 : 48}
            >
              {`Login to Wise Waste`}
            </Title>

            <TextInput
              label="Email Address"
              placeholder="hello@gmail.com"
              size="md"
              required
              {...form.getInputProps("email")}
              // error={""}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              mt="md"
              size="md"
              required
              {...form.getInputProps("password")}
              // error={""}
            />
            <Checkbox
              label="Keep me logged in"
              color="#C9C9C9"
              variant="outline"
              mt="xl"
              size="md"
              {...form.getInputProps("logincheckbox", { type: "checkbox" })}
            />
            <Button
              loading={btnLoading}
              id={classes.btn}
              fullWidth
              mt="xl"
              size="md"
              type="submit"
            >
              Login
            </Button>

            <Text ta="center" mt="md" mb={15}>
              Don&apos;t have an account?{" "}
              <a
                // fw={700}
                className={classes.register}
                onClick={(event) => {
                  navigate("/register", { replace: false });
                  event.preventDefault();
                }}
              >
                Register
              </a>
            </Text>
          </Box>
        </Paper>
      </div>
    </Transition>
  );
}
