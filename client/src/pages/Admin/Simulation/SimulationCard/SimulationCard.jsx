import {
  Avatar,
  Text,
  Group,
  Card,
  Loader,
  ActionIcon,
  rem,
  Slider,
} from "@mantine/core";
import classes from "./SimulationCard.module.css";
import { usePut } from "../../../../customHooks/usePut";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IconTrash } from "@tabler/icons-react";
import { useDelete } from "../../../../customHooks/useDelete";
import { useQueryClient } from "@tanstack/react-query";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
export function SimulationCard({ dustbindata, refetch }) {

  const queryClient = useQueryClient();

  const [dustbinToBeDeleted, setDustbinToBeDeleted] = useState("");
  const [endValue, setEndValue] = useState(-1);

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
    mutate: updateData,
    isPending: isUpdatePending,
  } = usePut({
    key: "simulationput",
    uri: `${BACKEND_URI}/admin/simulation?dustbinID=${dustbindata.dustbinID}`,
    data: {percentage : endValue},
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries("dustbindata");
      },
    },
  });

  useEffect(() => {
    if(endValue!= -1){
    console.log(endValue);
    updateData();
  }
}, [endValue,updateData])

  const handleDeleteZone = (dustbinID) => {
    setDustbinToBeDeleted(dustbinID);
    deletedata();
  };

  function getInitials(fullName) {
    return fullName
      .split(" ")
      .filter((name) => name.length > 0) // filter out empty strings
      .map((name) => name[0].toUpperCase())
      .join("");
  }

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
            <Avatar color="green" radius="md" size={100}>
              {getInitials(dustbindata.zone)}
            </Avatar>
          </div>
          <div className={classes.midDiv}>
            {/* <Text fz="md" fw={700} className={classes.name}>
              {`ID : ${dustbindata.dustbinID}`}
            </Text> */}
            <Group wrap="nowrap" gap={10} mt={3}>
              <Text fz="sm">{`ID : ${dustbindata.dustbinID}`}</Text>
            </Group>

            <Group wrap="nowrap" gap={10} mt={3}>
              <Text fz="sm" c="dimmed">
                {`${dustbindata.zone}`}
              </Text>
            </Group>

            <Group wrap="nowrap" gap={10} mt={3}>
              <Text fz="sm">{`Percentage Filled ↘`}</Text>
            </Group>

            <Slider
              color="var(--mantine-secondary-color-body)"
              size="xs"
              mt={10}
              labelAlwaysOn
              defaultValue={dustbindata.percentage}
              onChangeEnd={setEndValue}
              label={(value) => `${value}%`}
            />
          </div>
          <div
            onClick={() => handleDeleteZone(dustbindata.dustbinID)}
            className={classes.rightDiv}
          >
            {(isDeletionPending||isUpdatePending) ? (
              <Loader
                size={24}
                type="dots"
                color="var(--mantine-secondary-color-body)"
              />
            ) : (
              <Text fz="md" fw={700} className={classes.name}>
                <ActionIcon variant="subtle" color="red">
                  <IconTrash
                    style={{ width: rem(20), height: rem(20) }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Text>
            )}
          </div>
        </Group>
      </Card>
    </motion.div>
  );
}
