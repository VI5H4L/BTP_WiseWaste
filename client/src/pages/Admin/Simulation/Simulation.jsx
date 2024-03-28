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
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import Transition from "../../../Transition";
import classes from "./Simulation.module.css";
import { useMediaQuery } from "@mantine/hooks";
import { useGet } from "../../../customHooks/useGet";
import { usePost } from "../../../customHooks/usePost";
// import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import { useDelete } from "../../../customHooks/useDelete";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
const Simulation = () => {
  // const queryClient = useQueryClient();

  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const [dustbinToBeDeleted, setDustbinToBeDeleted] = useState("");
  const [dustbinData, setDustbinData] = useState({});

  const form = useForm({
    initialValues: {
      dustbinID: "",
      percentage: "",
      zone: "",
    },

    validate: (values) => {
      const errors = {};

      if (values.dustbinID.length > 6) {
        errors.dustbinID = "Dustbin ID must be 6 characters or less";
      }

      if (
        !Number.isInteger(values.percentage) ||
        values.percentage < 0 ||
        values.percentage > 100
      ) {
        errors.percentage = "% must be an integer between 0 and 100";
      }

      if (!values.zone) {
        errors.zone = "You must select a zone";
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
    data: simulationdata,
    isLoading: isgetDataLoading,
    refetch,
  } = useGet({
    key: "simulationget",
    uri: `${BACKEND_URI}/admin/simulation`,
    options: { refetchOnWindowFocus: true, refetchInterval: 10000 },
  });

  const { mutate: deletedata, isPending: isDeletionPending } = useDelete({
    key: "simulationdel",
    uri: `${BACKEND_URI}/admin/simulation?dustbinID=${dustbinToBeDeleted}`,
    options: {
      onSuccess: () => {
        refetch();
      },
    },
  });

  const {
    mutate: postData,
    isPending: isPostingPending,
    isError,
    error,
  } = usePost({
    key: "simulationpost",
    uri: `${BACKEND_URI}/admin/simulation`,
    data: dustbinData,
    options: {
      onSuccess: () => {
        refetch();
        // queryClient.invalidateQueries("wdata");
      },
    },
  });

  useEffect(() => {
    if (!isPostingPending && isError) {
      if (
        error.response.status == 400 &&
        error.response.data.message == "A dustbin with this ID already exists"
      ) {
        form.setFieldError("dustbinID", "Enter Unique ID! Try again");
      }
    }
  }, [isError, error, form, isPostingPending]);

  const handleAddZone = (values) => {
    setDustbinData(values);
    postData();
  };

  const handleDeleteZone = (dustbinID) => {
    setDustbinToBeDeleted(dustbinID);
    deletedata();
  };

  const rows =
    !isgetDataLoading &&
    simulationdata.length != 0 &&
    simulationdata.map((dustbindata) => (
      <Table.Tr key={dustbindata.dustbinID}>
        <Table.Td>
          <Group>
            <Text fz="sm" fw={500}>
              {dustbindata.dustbinID}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>
          <Group justify="center">
            <Text fz="sm" fw={500}>
              {dustbindata.percentage}
            </Text>
          </Group>
        </Table.Td>

        <Table.Td>
          <Group justify="flex-end">
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => handleDeleteZone(dustbindata.dustbinID)}
            >
              <IconTrash
                style={{ width: rem(20), height: rem(20) }}
                stroke={1.5}
              />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
    ));

  return (
    <Transition>
      <div className={classes.container}>
        <LoadingOverlay
          visible={isgetDataLoading || isZoneDataLoading}
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
          Simulation
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            handleAddZone(values);
          })}
          className={classes.grp}
        >
          <TextInput
            placeholder="Enter unique Dustbin ID"
            size="sm"
            mb={16}
            required
            {...form.getInputProps("dustbinID")}
            className={classes.input}
          />
          <NumberInput
            placeholder="Enter Dustbin's % filled"
            size="sm"
            mb={16}
            required
            {...form.getInputProps("percentage")}
            className={classes.input}
          />
          <Select
            size="sm"
            radius="sm"
            placeholder="Choose Dustbin's zone"
            checkIconPosition="right"
            data={!isZoneDataLoading && zonedata.zones}
            mb={16}
            required
            {...form.getInputProps("zone")}
            className={classes.input}
            nothingFoundMessage="Nothing found..."
            clearable
          />
          <Button
            fullWidth
            loading={isgetDataLoading || isDeletionPending || isPostingPending}
            size="sm"
            type="submit" // make this button submit the form
            id={classes.btn1}
          >
            Add Dustbin
          </Button>
        </form>

        {!isgetDataLoading && simulationdata.length != 0 && (
          <Table.ScrollContainer className={classes.tblcontainer}>
            <Table verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>
                    <Title className={classes.tablehead} order={6}>
                      ID
                    </Title>
                  </Table.Th>
                  <Table.Th>
                    <Title className={classes.tablehead} order={6} ta="center">
                      %
                    </Title>
                  </Table.Th>
                  <Table.Th>
                    <Title className={classes.tablehead} order={6} ta="right">
                      Delete
                    </Title>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </div>
    </Transition>
  );
};

export default Simulation;
