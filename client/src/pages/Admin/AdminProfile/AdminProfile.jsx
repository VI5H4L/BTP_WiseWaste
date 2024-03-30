import { useState } from "react";
import {
  Title,
  useMantineTheme,
  Button,
  TextInput,
  LoadingOverlay,
  Text,
  Paper,
  Avatar,
  Divider,
  PasswordInput,
} from "@mantine/core";
import Transition from "../../../Transition";
import classes from "./AdminProfile.module.css";
import { useMediaQuery } from "@mantine/hooks";
import { useGet } from "../../../customHooks/useGet";
import { usePut } from "../../../customHooks/usePut";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
const AdminProfile = () => {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [pno, setPno] = useState("");
  const [password, setPassword] = useState("");

  const {
    data: profiledata,
    isLoading: isProfileDataLoading,
    refetch,
  } = useGet({
    key: "profileget",
    uri: `${BACKEND_URI}/worker/profile?emailID=${localStorage.getItem("userEmail")}`,
    options: { refetchOnWindowFocus: true, refetchInterval: 10000 },
  });

  const { mutate: updateData, isPending: isUpdatePending } = usePut({
    key: "profileupdate",
    uri: `${BACKEND_URI}/worker/profile?emailID=${localStorage.getItem("userEmail")}`,
    data: { phone: pno ,password:password},
    options: {
      onSuccess: () => {
        refetch();
        notifications.show({
          title: "Update Successful",
          message: "Profile Updated successfully!!",
          color: "var(--mantine-secondary-color-body)",
          withBorder: "true",
        });
      },
    },
  });

  const form = useForm({
    initialValues: {
      phone: "9999999999",
      password: "",
      confirmpassword: "",
    },

    validate: {
      password:  (value, values) =>
      values.password == "" ? null : (value.length>7?null:"Password must be 8 characters long"),
      confirmpassword: (value, values) =>
        values.password === value ? null : (values.password==""?null:"Passwords do not match"),
      phone: (value) =>
        value.toString().length === 10
          ? null
          : "Please enter a valid 10-digit phone number",
    },
  });

  const handleUpdate = async (values) => {
    setPno(values.phone);
    setPassword(values.password);
    updateData();
  };

  function getInitials(fullName) {
    return fullName
      .split(" ")
      .filter((name) => name.length > 0) // filter out empty strings
      .map((name) => name[0].toUpperCase())
      .join("");
  }

  return (
    <Transition>
      <div className={classes.container}>
        <LoadingOverlay
          visible={isProfileDataLoading || isUpdatePending}
          zIndex={10}
          transitionProps={{ transition: "fade", duration: "500" }}
          loaderProps={{ color: "#8CE99A", type: "bars" }}
          overlayProps={{
            radius: "sm",
            color: "#1f1f1f",
            backgroundOpacity: "0.8",
            blur: "1",
          }}
        />

        <Title
          order={mobile ? 3 : 2}
          className={classes.title}
          ta="center"
          mt={mobile ? 16 : 24}
          mb={mobile ? 32 : 48}
        >
          Admin Profile
        </Title>

        <div className={classes.mainDiv}>
          <div className={classes.leftDiv}>
            <Paper
              withBorder
              radius="md"
              p="lg"
              bg="var(--mantine-color-dark-7)"
            >
              <Avatar color="green" radius="md" mx="auto" size={120}>
                {!isProfileDataLoading
                  ? getInitials(profiledata.fullName)
                  : getInitials("Abc Xyz")}
              </Avatar>
              <Text ta="center" fz="lg" fw={500} mt="md">
                {!isProfileDataLoading ? profiledata.fullName : "Abc Xyz"}
              </Text>
              <Divider my={10} />
              <Text ta="center" c="dark.2" fz="sm">
                {!isProfileDataLoading
                  ? profiledata.emailID
                  : "hello@gmail.com"}
              </Text>
              <Divider my={10} />
              <Text ta="center" c="dark.2" fz="sm">
                {"ADMIN"}
              </Text>
            </Paper>
          </div>

          {true && (
            <form
              onSubmit={form.onSubmit((values) => {
                handleUpdate(values);
              })}
              className={classes.grp}
            >
              <TextInput
                label="Email Address"
                disabled
                value={
                  !isProfileDataLoading
                    ? profiledata.emailID
                    : "hello@gmail.com"
                }
                placeholder="Email ID"
                size="sm"
                mb={16}
                classNames={classes}
              />
              <TextInput
                type="tel"
                label="Phone"
                required
                maxLength={10}
                {...form.getInputProps("phone")}
                value={
                  form.values.phone != "9999999999"
                    ? form.values.phone
                    : !isProfileDataLoading
                    ? profiledata.phone
                    : form.values.phone
                }
                onChange={(event) => {
                  const value = event.target.value;
                  const isValid = /^\d+$/.test(value); // Check if the input is a number
                  if (isValid || value == "") {
                    form.setFieldValue("phone", value);
                  }
                }}
                placeholder="Phone"
                size="sm"
                mb={16}
                classNames={classes}
              />

              <PasswordInput
                label="New Password"
                placeholder="Your new password"
                size="sm"
                mb={16}
                {...form.getInputProps("password")}
                classNames={classes}
              />
              <PasswordInput
                label="Confirm new Password"
                placeholder="Confirm your new password"
                size="sm"
                mb={16}
                {...form.getInputProps("confirmpassword")}
                classNames={classes}
              />

              <Button
                fullWidth
                loading={isProfileDataLoading || isUpdatePending}
                size="sm"
                type="submit" // make this button submit the form
                id={classes.btn1}
              >
                Update Profile
              </Button>
            </form>
          )}
        </div>
      </div>
    </Transition>
  );
};

export default AdminProfile;
