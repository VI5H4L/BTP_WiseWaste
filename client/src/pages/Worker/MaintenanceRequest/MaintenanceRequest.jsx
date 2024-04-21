import { useState, useEffect } from "react";
import {
  Title,
  useMantineTheme,
  Button,
  TextInput,
  LoadingOverlay,
  Select,
  Textarea,
} from "@mantine/core";
import Transition from "../../../Transition";
import classes from "./MaintenanceRequest.module.css";
import { useMediaQuery } from "@mantine/hooks";
import { useGet } from "../../../customHooks/useGet";
import { usePost } from "../../../customHooks/usePost";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
const MaintenanceRequest = () => {

  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const [formData, setFormData] = useState({});

  const form = useForm({
    initialValues: {
      issueCategory:"",
      dustbinID: "",
      zone: "",
      urgency: "",
      description:"",
    },

    validate: (values) => {
      const errors = {};

      if (values.dustbinID.length > 6) {
        errors.dustbinID = "Dustbin ID must be 6 characters or less";
      }

      if (!values.zone) {
        errors.zone = "You must select a zone";
      }
      if (!values.urgency) {
        errors.urgency = "You must select an Urgency Level";
      }
      if (!values.issueCategory) {
        errors.issueCategory = "You must select a Category";
      }
      if (!values.description) {
        errors.description = "You must provide some description";
      }

      return errors;
    },
  });

  const { data: zonedata, isLoading: isZoneDataLoading } = useGet({
    key: "managezone",
    uri: `${BACKEND_URI}/admin/managezoneget`,
    options: { refetchOnWindowFocus: true, refetchInterval: 10000 },
  });

  const {
    mutate: postData,
    isPending: isPostingPending,
    isError,
  } = usePost({
    key: "maintenancepost",
    uri: `${BACKEND_URI}/worker/maintenance-request`,
    data: {...formData, reporterID:localStorage.getItem("userEmail")},
    options: {
      onSuccess: () => {
        notifications.show({
          title: "Request Successful",
          message: "Request Sent successfully!!",
          color: "var(--mantine-secondary-color-body)",
          withBorder: "true",
        });
      },
    },
  });

  useEffect(() => {
    if (!isPostingPending && isError) {
      notifications.show({
        title: "Request Failed",
        message: "Please try again!!",
        color: "red",
        withBorder: "true",
      });
    }
  }, [isError,isPostingPending]);

  return (
    <Transition>
      <div className={classes.container}>
        <LoadingOverlay
          visible={isZoneDataLoading}
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
          Maintenance Request
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            setFormData(values);
            postData();
          })}
          className={classes.grp}
        >
          <Select
            size="sm"
            radius="sm"
            label="Choose Issue Category"
            placeholder="Click to choose"
            checkIconPosition="right"
            data={[
              "Fullness",
              "Damage",
              "Technical Issue",
              "Vandalism",
              "Other",
            ]}
            mb={16}
            required
            {...form.getInputProps("issueCategory")}
            className={classes.input}
            nothingFoundMessage="Nothing found..."
            clearable
          />
          <TextInput
            label="Enter Dustbin ID"
            required
            placeholder="DUSID1"
            size="sm"
            mb={16}
            {...form.getInputProps("dustbinID")}
            className={classes.input}
          />
          <Select
            size="sm"
            radius="sm"
            label="Choose Zone"
            placeholder="Click to choose"
            checkIconPosition="right"
            data={!isZoneDataLoading && zonedata.zones}
            mb={16}
            required
            {...form.getInputProps("zone")}
            className={classes.input}
            nothingFoundMessage="Nothing found..."
            clearable
          />
          <Select
            size="sm"
            radius="sm"
            label="Choose Urgency Level"
            placeholder="Click to choose"
            checkIconPosition="right"
            data={["Low", "Medium", "High"]}
            mb={16}
            required
            {...form.getInputProps("urgency")}
            className={classes.input}
            nothingFoundMessage="Nothing found..."
            clearable
          />
          <Textarea
            label="Enter Description"
            placeholder="Tell details about the request/inquiry"
            required
            mb={16}
            {...form.getInputProps("description")}
            className={classes.input}
          />
          <Button
            fullWidth
            loading={isZoneDataLoading || isPostingPending}
            size="sm"
            type="submit"
            id={classes.btn1}
          >
            Send Request
          </Button>
        </form>
      </div>
    </Transition>
  );
};

export default MaintenanceRequest;
