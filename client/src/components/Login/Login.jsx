import {Paper,TextInput,PasswordInput,Checkbox,Box,Button,Title,Text,useMantineTheme,
   // Anchor,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {  useForm,  isEmail,  hasLength} from "@mantine/form";
import classes from "./Login.module.css";
import { useBackButton } from "../../customHooks/useBackButton";
import { useNavigate } from "react-router-dom";
import { notifications } from '@mantine/notifications';
import axios from "axios";


export function Login() {
  useBackButton("/");

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      logincheckbox: false
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
      console.log(values);
      const uri = `https://backend-wisewaste.vercel.app/authentication/login`;
      console.log(uri);
      const response = await axios.post(uri, {
        emailID: values.email,
        password: values.password,
      });
      console.log(response.data);

      if (response.data.success) {
        console.log("Success Login");
          notifications.show({
            title:"Logged In Successfully",
            message: 'Speedy work on Progress..',
            color:"var(--mantine-secondary-color-body)",
            withBorder :"true"
          });
      } else {
        console.log("Failed Login");
        notifications.show({
          title:"Log In Failed",
          message: 'Please try Again',
          color:"red",
          withBorder :"true"
        });
      }
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={mobile ? 16 : 24}>
        <Box component="form" 
          onSubmit={form.onSubmit((values) => {
            handleLogin(values);
          })}
          >
          <Title
            order={mobile?3:2}
            className={classes.title}
            ta="center"
            mt={50}
            mb={50}
          >
            {`Login to Wise Waste↘`}
          </Title>

          <TextInput
            label="Email address"
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
          <Checkbox label="Keep me logged in" color="#C9C9C9" variant="outline" mt="xl" size="md" {...form.getInputProps("logincheckbox",{ type: 'checkbox' })}/>
          <Button id={classes.btn} fullWidth mt="xl" size="md" type="submit">
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
  );
}
