import { Avatar, Text, Group, Card, Select } from "@mantine/core";
import { IconPhoneCall, IconAt } from "@tabler/icons-react";
import { useState,useEffect } from "react";
import classes from "./WorkerCard.module.css";
import { useGet } from "../../../../customHooks/useGet";

const mobile = window.screen.width < 768;
const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
export function WorkerCard() {
  const [zones,setZones]= useState([]);
  const [value, setValue] = useState("Zone A");

  const optionsFilter = ({ options, search }) => {
    const filtered = options.filter((option) =>
      option.label.toLowerCase().trim().includes(search.toLowerCase().trim())
    );

    // filtered.sort((a, b) => a.label.localeCompare(b.label));
    return filtered;
  };

  function getInitials(fullName) {
    return fullName
      .split(" ")
      .map((name) => name[0].toUpperCase())
      .join("");
  }

  const { data: zonedata, isLoading } = useGet({
    key: "managezone",
    uri: `${BACKEND_URI}/admin/managezone`,
    options: { refetchOnWindowFocus: true, refetchInterval: 6000 },
  });
  useEffect(() => {
    if (!isLoading) {
      setZones(zonedata.zones);
    }
  }, [zones, zonedata, isLoading]);
  return (
    <Card withBorder p="sm" radius="md" className={classes.card}>
      <Group wrap="nowrap">
        <div className={classes.avatarDiv}>
          <Avatar color="green" radius="md" size={120}>
            {getInitials("Vishal Kumar")}
          </Avatar>
        </div>
        <div className={classes.rightDiv}>
          <Text fz="lg" fw={700} className={classes.name}>
            Vishal Kumar
          </Text>

          <Group wrap="nowrap" gap={10} mt={3}>
            <IconAt stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="sm" c="dimmed">
              wisewaste.btp@gmail.com
            </Text>
          </Group>

          <Group wrap="nowrap" gap={10} mt={5}>
            <IconPhoneCall stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="sm" c="dimmed">
              +91 9205734004
            </Text>
          </Group>

          <Select
            mt={10}
            size="sm"
            radius="sm"
            placeholder="Allocate Zone"
            checkIconPosition="right"
            data={!isLoading && zones}
            classNames={classes}
            // value={value}
            onChange={setValue}
            filter={optionsFilter}
            nothingFoundMessage="Nothing found..."
            defaultValue={"Zone A"}
            searchable={mobile ? false : true}
            clearable
          />
        </div>
      </Group>
    </Card>
  );
}
