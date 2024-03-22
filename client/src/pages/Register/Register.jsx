import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Box,
  Title,
  Text,
  useMantineTheme,
  Modal,
  PinInput,
} from "@mantine/core";
import { useForm, isEmail, hasLength, isNotEmpty } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import classes from "./Register.module.css";
import { useBackButton } from "../../customHooks/useBackButton";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import axios from "axios";
import Transition from "../../Transition";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
export function Register() {
  useBackButton("/login");

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmpassword: "",
      phone: "",
    },

    validate: {
      name: isNotEmpty("Name cannot be empty"),
      email: isEmail("Enter valid email"),
      password: hasLength({ min: 8 }, "Password must be 8 characters long"),
      confirmpassword: (value, values) =>
        values.password === value ? null : "Passwords do not match",
      phone: (value) =>
        value.toString().length === 10
          ? null
          : "Please enter a valid 10-digit phone number",
    },
  });

  const navigate = useNavigate();
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const [modalOpen, setModalOpen] = useState(false);
  const [otp, setOtp] = useState(Array(4).fill(""));
  const [emailID, setEmailID] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [otpBtnLoading, setOtpBtnLoading] = useState(false);

  const handleRegister = async (values) => {
    // console.log(values);
    try {
      setBtnLoading(true);
      setEmailID(values.email);
      const uri = `${BACKEND_URI}/authentication/signup`;
      const response = await axios.post(uri, {
        fullName: values.name,
        emailID: values.email,
        password: values.password,
        phone: values.phone.toString(),
      });
      console.log(response.data);

      if (response.data.success) {
        setBtnLoading(false);
        setModalOpen(true);
        notifications.show({
          title: "OTP Sent Successfully",
          message: "Check your registered email",
          color: "var(--mantine-color-green-light)",
          withBorder: "true",
        });
      } else if (
        response.data.success == false &&
        response.data.code == "admindone"
      ) {
        setBtnLoading(false);
        setModalOpen(false);
        notifications.show({
          title: "Already Approved",
          message: "Admin has already approved your request",
          color: "var(--mantine-color-green-light)",
          withBorder: "true",
        });
      } else if (
        response.data.success == false &&
        response.data.code == "adminres"
      ) {
        setBtnLoading(false);
        setModalOpen(false);
        notifications.show({
          title: "Wait",
          message: "Wait for Admin's response.",
          color: "var(--mantine-color-green-light)",
          withBorder: "true",
        });
      } else {
        setBtnLoading(false);
        console.log("Failed signup");
        notifications.show({
          title: "Failed Login",
          message: "Login has been Failed",
          color: "red",
          withBorder: "true",
        });
      }
    } catch (error) {
      setBtnLoading(false);
      console.error(error.response.data);
      notifications.show({
        title: "Failed Login",
        message: "Login has been Failed",
        color: "red",
        withBorder: "true",
      });
    }
  };

  const handleOTP = async () => {
    try {
      setOtpBtnLoading(true);
      const otpInteger = parseInt(otp.join(""), 10);
      const otpString = otpInteger.toString();

      // TODO: Verify the OTP with your backend here
      console.log("Verifying OTP:", otpInteger);

      const uri = `${BACKEND_URI}/emailverify/verify_email`;
      const response = await axios.post(uri, {
        emailID: emailID,
        otp: otpString,
      });
      console.log(response.data);

      if (response.data.success && response.data.verified) {
        setOtpBtnLoading(false);
        console.log("Successfully verified OTP");
        notifications.show({
          title: "Request Sent Successfully",
          message: "Wait for the Approval on registered email",
          color: "#C9C9C9",
          withBorder: "true",
        });
        navigate("/login");
      } else {
        setOtpBtnLoading(false);
        console.log("OTP verification failed");
        notifications.show({
          title: "OTP verification failed",
          message: "Please try again...",
          color: "red",
          withBorder: "true",
        });
      }
    } catch (error) {
      setOtpBtnLoading(false);
      console.error(error.response.data);
      notifications.show({
        title: "OTP verification failed",
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
            component="form"
            mt={56}
            onSubmit={form.onSubmit((values) => {
              handleRegister(values);
            })}
          >
            <Title
              order={mobile ? 3 : 2}
              className={classes.title}
              ta="center"
              mt={mobile ? 16 : 24}
              mb={mobile ? 32 : 48}
            >
              {`Join Wise Waste Initiative`}
            </Title>

            <TextInput
              label="Full Name"
              placeholder="Abc Xyz"
              size="md"
              required
              error={""}
              {...form.getInputProps("name")}
            />

            <TextInput
              label="Email Address"
              placeholder="hello@gmail.com"
              mt="md"
              size="md"
              required
              {...form.getInputProps("email")}
              // error={""}
            />
            <TextInput
              type="tel"
              label="Phone Number"
              placeholder="92xxxxxx04"
              mt="md"
              size="md"
              maxLength={10}
              required
              {...form.getInputProps("phone")}
              onChange={(event) => {
                const value = event.target.value;
                const isValid = /^\d+$/.test(value); // Check if the input is a number
                if (isValid || value === "") {
                  form.setFieldValue("phone", value);
                }
              }}
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
            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              mt="md"
              size="md"
              required
              {...form.getInputProps("confirmpassword")}
              // error={""}
            />

            <Button
              loading={btnLoading}
              id={classes.btn}
              fullWidth
              mt="xl"
              size="md"
              type="submit"
            >
              Next
            </Button>

            <Text ta="center" mt="md" mb={15}>
              Have an account already?{" "}
              <a
                // fw={700}
                className={classes.register}
                onClick={(event) => {
                  navigate("/login", { replace: false });
                  event.preventDefault();
                }}
              >
                Login
              </a>
            </Text>
          </Box>
        </Paper>

        <Modal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          title="OTP Verification"
          size="md"
          centered
        >
          <div className={classes.modalContent}>
            <Text>Please enter the OTP sent to your email:</Text>
            <PinInput
              length={4}
              value={otp.join("")}
              type="number"
              placeholder="*"
              onChange={(value) => setOtp(value.split(""))}
            />
            <Button
              color="var(--mantine-color-green-light)"
              fullWidth
              size="md"
              onClick={handleOTP}
              loading={otpBtnLoading}
            >
              Login
            </Button>
          </div>
        </Modal>
      </div>
    </Transition>
  );
}
