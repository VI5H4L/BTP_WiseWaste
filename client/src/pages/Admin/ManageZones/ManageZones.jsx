import { useState,useEffect } from "react";
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
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import Transition from "../../../Transition";
import classes from "./ManageZones.module.css";
import { useMediaQuery } from "@mantine/hooks";
import { useGet } from "../../../customHooks/useGet";
import { usePut } from "../../../customHooks/usePut";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
const ManageZones = () => {
  const [zones, setZones] = useState([]);
  const [newZone, setNewZone] = useState("");
  const [error, setError] = useState("");

  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const {data: zonedata,isLoading,refetch,} = useGet({
    key: "managezone",
    uri: `${BACKEND_URI}/admin/managezone`,
    options: { refetchOnWindowFocus: true, refetchInterval: 6000 },
  });
  useEffect(() => {
    if (!isLoading) {
      setZones(zonedata.zones);
    }
  }, [zones,zonedata,isLoading]);

  const { mutate: updateData,isPending } = usePut({
    key: "managezone",
    uri: `${BACKEND_URI}/admin/managezone`,
    data: { zones: zones },
    options: {
      onSuccess: () => {
        refetch();
      },
    },
  });

  const handleAddZone = (event) => {
    event.preventDefault();
    if (newZone === "") {
      setError("Zone name cannot be empty");
    } else if (zones.some(zone => zone.toLowerCase() === newZone.toLowerCase())) {
      setError("Zone name must be unique");
    } else {
      setZones(currentZones => [...currentZones, newZone]);
      setNewZone("");
      setError("");
      updateData();
    }
  };

  const handleDeleteZone = (zoneToDelete) => {
    setZones(currentZones => currentZones.filter(zone => zone !== zoneToDelete));
    updateData();
  };

  const rows = (!isLoading && zonedata.zones.length != 0) && zonedata.zones.map((zone) => (
    <Table.Tr key={zone}>
      <Table.Td>
        <Group>
          <Text fz="md" fw={500}>
            {zone}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Group justify="flex-end">
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => handleDeleteZone(zone)}
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
          visible={isLoading}
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
          Manage Zones
        </Title>

        <form onSubmit={handleAddZone} className={classes.grp}>
          <TextInput
            placeholder="Enter zone name"
            size="md"
            mb={16}
            value={newZone}
            onChange={(event) => setNewZone(event.target.value)}
            error={error}
            className={classes.input}
          />
          <Button
            fullWidth
            loading={isLoading || isPending}
            size="md"
            type="submit" // make this button submit the form
            id={classes.btn1}
          >
            Add Zone
          </Button>
        </form>

        {!isLoading && zonedata.zones.length != 0 && (
          <Table.ScrollContainer className={classes.tblcontainer}>
            <Table verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>
                    <Title className={classes.tablehead} order={5}>
                      Zone Name
                    </Title>
                  </Table.Th>
                  <Table.Th>
                    <Title className={classes.tablehead} order={5} ta="right">
                      Delete Zone
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

export default ManageZones;
