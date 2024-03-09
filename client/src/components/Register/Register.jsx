import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Box,
  Title,
  Text,
  useMantineTheme,
  // Anchor,
} from "@mantine/core";
import {
  useForm,
  isEmail,
  hasLength,
  isNotEmpty
} from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import classes from "./Register.module.css";
import { useBackButton } from "../../customHooks/useBackButton";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

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

  const handleRegister = () => {
    notifications.show({
      title: "Request Sent Successfully",
      message: "Wait for the Approval on registered email",
      color: "#C9C9C9",
      withBorder: "true",
    });
  };
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={mobile ? 16 : 24} >
        <Box
          component="form"
          onSubmit={form.onSubmit((values) => console.log(values))}
        >
          <Title
            order={2}
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
          <Button
            id={classes.btn}
            onClick={() => {
              handleRegister();
            }}
            fullWidth
            mt="xl"
            size="md"
            type="submit"
          >
            {"Register"}
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
    </div>
  );
}
