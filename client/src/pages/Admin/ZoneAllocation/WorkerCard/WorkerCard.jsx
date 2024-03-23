import { Avatar, Text, Group, Card, Select } from "@mantine/core";
import { IconPhoneCall, IconAt } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import classes from "./WorkerCard.module.css";
import { useGet } from "../../../../customHooks/useGet";
import { usePut } from "../../../../customHooks/usePut";

// const mobile = window.screen.width < 768;
const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

export function WorkerCard({ workerdata, refetchWorkerData }) {
  const [zones, setZones] = useState([]);
  const [val, setVal] = useState("");

  const optionsFilter = ({ options, search }) => {
    const filtered = options.filter((option) =>
      option.label.toLowerCase().trim().includes(search.toLowerCase().trim())
    );
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
    uri: `${BACKEND_URI}/admin/managezoneget`,
    options: { refetchOnWindowFocus: true, refetchInterval: 6000 },
  });
  useEffect(() => {
    if (!isLoading) {
      setZones(zonedata.zones);
      workerdata.zoneAlloted != "na"
        ? setVal(workerdata.zoneAlloted)
        : setVal("");
    }
  }, [workerdata.zoneAlloted, zones, zonedata, isLoading]);

  const { mutate: updateWorkerData } = usePut({
    key: "workerdata",
    uri: `${BACKEND_URI}/admin/allotzone?emailID=${workerdata.emailID}`,
    data: { zoneAlloted: val },
    options: {
      onSuccess: () => {
        refetchWorkerData();
      },
    },
  });
  useEffect(() => {
    //Write code for pushing data
    if (val == undefined) {
      setVal("na");
    } else if (val != "") {
      updateWorkerData();
    }
  }, [val, updateWorkerData]);

  return (
    <Card withBorder p="sm" radius="md" className={classes.card}>
      <Group wrap="nowrap">
        <div className={classes.avatarDiv}>
          <Avatar color="green" radius="md" size={120}>
            {getInitials(workerdata.fullName)}
          </Avatar>
        </div>
        <div className={classes.rightDiv}>
          <Text fz="lg" fw={700} className={classes.name}>
            {workerdata.fullName}
          </Text>

          <Group wrap="nowrap" gap={10} mt={3}>
            <IconAt stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="sm" c="dimmed">
              {workerdata.emailID}
            </Text>
          </Group>

          <Group wrap="nowrap" gap={10} mt={5}>
            <IconPhoneCall stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="sm" c="dimmed">
              {workerdata.phone}
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
            value={val}
            onChange={setVal}
            filter={optionsFilter}
            nothingFoundMessage="Nothing found..."
            clearable
          />
        </div>
      </Group>
    </Card>
  );
}
