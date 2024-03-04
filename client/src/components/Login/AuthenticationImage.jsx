import {
  Paper,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  // Anchor,
} from "@mantine/core";
import classes from "./AuthenticationImage.module.css";

export function AuthenticationImage() {
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={24}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Welcome to Wise Waste!!
        </Title>

        <TextInput
          label="Email address"
          placeholder="hello@gmail.com"
          size="md"
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          mt="md"
          size="md"
        />
        <Checkbox label="Keep me logged in" mt="xl" size="md" />
        <Button className={classes.btn} fullWidth mt="xl" size="md">
          Login
        </Button>

        <Text ta="center" mt="md">
          Don&apos;t have an account?{" "}
          <a
            href="#"
            // fw={700}
            className={classes.register}
            onClick={(event) => event.preventDefault()}
          >
            Register
          </a>
        </Text>
      </Paper>
    </div>
  );
}
