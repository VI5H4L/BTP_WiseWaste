import { useState, useEffect } from "react";
import {
  Title,
  useMantineTheme,
  Button,
  TextInput,
  LoadingOverlay,
  Table,
  Group,
  Text,
  ActionIcon,
  rem,
  Select,
  NumberInput,
  Paper,
  Avatar,
  Divider,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import Transition from "../../../Transition";
import classes from "./WorkerProfile.module.css";
import { useMediaQuery } from "@mantine/hooks";
import { useGet } from "../../../customHooks/useGet";
import { usePost } from "../../../customHooks/usePost";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import { useDelete } from "../../../customHooks/useDelete";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
const WorkerProfile = () => {
  const queryClient = useQueryClient();

  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return (
    <Transition>
      <div className={classes.container}>
        <LoadingOverlay
          visible={false}
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
          Worker Profile
        </Title>

        <div className={classes.mainDiv}>
          <div className={classes.leftDiv}>
            <Paper
              withBorder
              radius="md"
              p="lg"
              mx={16}
              bg="var(--mantine-color-dark-7)"
            >
              <Avatar color="green" radius="md" mx="auto" size={120}>
                {"VK"}
              </Avatar>
              <Text ta="center" fz="lg" fw={500} mt="md">
                Vishal Kumar
              </Text>
              {/* <Text ta="center" c="dimmed" fz="md">
            vishal.kr2003@gmail.com
          </Text> */}
              <Divider my={10} />
              <Text ta="center" c="dimmed" fz="md">
                vishal.kr2003@gmail.com
              </Text>
              <Divider my={10} />
              <Text ta="center" c="dimmed" fz="md">
                Zone : Zone A
              </Text>
            </Paper>
          </div>

          <form
            //   onSubmit={}
            className={classes.grp}
          >
            <TextInput
              label="Email Address"
              disabled
              defaultValue="vishal.kr2003@gmail.com"
              placeholder="Email ID"
              size="sm"
              mb={16}
              // required
              // {...form.getInputProps("dustbinID")}
              classNames={classes}
            />
            <TextInput
              label="Phone"
            //   disabled
              defaultValue="9205734004"
              placeholder="Phone"
              size="sm"
              mb={16}
            //   required
              // {...form.getInputProps("dustbinID")}
              classNames={classes}
            />
            <TextInput
              label="Alloted Zone"
              disabled
              defaultValue="Not Alloted"
              placeholder="Alloted Zone"
              size="sm"
              mb={16}
            //   required
              // {...form.getInputProps("dustbinID")}
              classNames={classes}
            />
        
            <Button
              fullWidth
              loading={false}
              size="sm"
              type="submit" // make this button submit the form
              id={classes.btn1}
            >
              Update Profile
            </Button>
          </form>
        </div>
      </div>
    </Transition>
  );
};

export default WorkerProfile;
