import { Avatar, Text, Group, Card, Select } from "@mantine/core";
import { IconPhoneCall, IconAt } from "@tabler/icons-react";
import { useState } from "react";
import classes from "./WorkerCard.module.css";
import { usePut } from "../../../../customHooks/usePut";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
// const mobile = window.screen.width < 768;
const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

export function WorkerCard({ workerdata, childZones }) {
  const queryClient = useQueryClient();

  const [val, setVal] = useState();

  const optionsFilter = ({ options, search }) => {
    const filtered = options.filter((option) =>
      option.label.toLowerCase().trim().includes(search.toLowerCase().trim())
    );
    return filtered;
  };

  function getInitials(fullName) {
    return fullName
      .split(" ")
      .filter((name) => name.length > 0) // filter out empty strings
      .map((name) => name[0].toUpperCase())
      .join("");
  }

  const { mutate: updateWorkerData } = usePut({
    key: "workerdata",
    uri: `${BACKEND_URI}/admin/allotzone?emailID=${workerdata.emailID}`,
    data: { zoneAlloted: val },
    options: {
      onSuccess: () => {
        // refetchWorkerData();
        queryClient.invalidateQueries("wdata");
      },
    },
  });

  const handleEmailClick = () => {
    window.open(`mailto:${workerdata.emailID}`);
  };

  const handlePhoneClick = () => {
    window.open(`tel:${workerdata.phone}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
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
              <Text
                fz="sm"
                c="dimmed"
                onClick={handleEmailClick}
                style={{ cursor: "pointer" }}
              >
                {workerdata.emailID}
              </Text>
            </Group>

            <Group wrap="nowrap" gap={10} mt={5}>
              <IconPhoneCall
                stroke={1.5}
                size="1rem"
                className={classes.icon}
              />
              <Text
                fz="sm"
                c="dimmed"
                onClick={handlePhoneClick}
                style={{ cursor: "pointer" }}
              >
                {workerdata.phone}
              </Text>
            </Group>

            <Select
              mt={10}
              size="sm"
              radius="sm"
              placeholder="Allocate Zone"
              checkIconPosition="right"
              data={childZones}
              classNames={classes}
              value={
                val != undefined
                  ? val
                  : workerdata.zoneAlloted != "na"
                  ? workerdata.zoneAlloted
                  : ""
              }
              onChange={(value) => {
                if (value == undefined) setVal("na");
                else setVal(value);
                updateWorkerData();
              }}
              filter={optionsFilter}
              nothingFoundMessage="Nothing found..."
              clearable
            />
          </div>
        </Group>
      </Card>
    </motion.div>
  );
}
