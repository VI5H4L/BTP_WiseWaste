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

export function Register() {
  useBackButton("/login");

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmpassword: "",
    },

    validate: {
      name: isNotEmpty("Name cannot be empty"),
      email: isEmail("Enter valid email"),
      password: hasLength({ min: 8 }, "Password must be 8 characters long"),
      confirmpassword: (value, values) =>
        values.password === value ? null : "Passwords do not match",
    },
  });

  const navigate = useNavigate();
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const [modalOpen, setModalOpen] = useState(false);
  const [otp, setOtp] = useState(Array(4).fill(""));
  const [emailID, setEmailID] = useState("");

  const handleRegister = async (values) => {
    try {
      // setFormData(values);
      setEmailID(values.email);
      const uri = `https://backend-wisewaste.vercel.app/authentication/signup`;
      console.log(uri);
      const response = await axios.post(uri, {
        fullName: values.name,
        emailID: values.email,
        password: values.password,
      });
      console.log(response.data);

      if (response.data.success) {
        console.log("Success signup");
        setModalOpen(true);
        notifications.show({
          title: "OTP Sent Successfully",
          message: "Check your registered email",
          color: "var(--mantine-color-green-light)",
          withBorder: "true",
        });
      } else {
        console.log("Failed signup");
      }
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const handleOTP = async () => {
    try {
      const otpInteger = parseInt(otp.join(""), 10);
      const otpString = otpInteger.toString();

      // TODO: Verify the OTP with your backend here
      console.log("Verifying OTP:", otpInteger);

      const uri = `https://backend-wisewaste.vercel.app/emailverify/verify_email`;
      console.log(uri);
      const response = await axios.post(uri, {
        emailID: emailID,
        otp: otpString,
      });
      console.log(response.data);

      if (response.data.success) {
        console.log("Successfully verified OTP");
        notifications.show({
          title: "Request Sent Successfully",
          message: "Wait for the Approval on registered email",
          color: "#C9C9C9",
          withBorder: "true",
        });
        navigate("/login");
      } else {
        console.log("OTP verification failed");
      }
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={mobile ? 16 : 24}>
        <Box
          component="form"
          onSubmit={form.onSubmit((values) => {
            handleRegister(values);
          })}
        >
          <Title
            order={mobile ? 3 : 2}
            className={classes.title}
            ta="center"
            mt={50}
            mb={50}
          >
            {`Join Wise Waste Initiative↘`}
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
            label="Email address"
            placeholder="hello@gmail.com"
            mt="md"
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
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            mt="md"
            size="md"
            required
            {...form.getInputProps("confirmpassword")}
            // error={""}
          />

          <Button id={classes.btn} fullWidth mt="xl" size="md" type="submit">
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
          >
            Login
          </Button>
        </div>
      </Modal>
    </div>
  );
}
