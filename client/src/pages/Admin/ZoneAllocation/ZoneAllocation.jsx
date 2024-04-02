import Transition from "../../../Transition";
import { Title, Select, Grid, LoadingOverlay } from "@mantine/core";
import { useBackButton } from "../../../customHooks/useBackButton";
import classes from "./ZoneAllocation.module.css";
import { useState, useEffect } from "react";
import { WorkerCard } from "./WorkerCard/WorkerCard";
import { useGet } from "../../../customHooks/useGet";
import { AnimatePresence, motion } from "framer-motion";

const mobile = window.screen.width < 768;
const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

export function ZoneAllocation() {
  useBackButton("/");

  const [zones, setZones] = useState([]);
  const [val, setVal] = useState();

  const optionsFilter = ({ options, search }) => {
    const filtered = options.filter((option) =>
      option.label.toLowerCase().trim().includes(search.toLowerCase().trim())
    );
    // filtered.sort((a, b) => a.label.localeCompare(b.label));
    return filtered;
  };

  const { data: zonedata, isLoading: zoneDataLoading } = useGet({
    key: "managezone",
    uri: `${BACKEND_URI}/admin/managezoneget`,
    options: { refetchOnWindowFocus: true, refetchInterval: 10000 },
  });
  useEffect(() => {
    if (!zoneDataLoading) {
      setZones(zonedata.zones);
    }
  }, [zones, zonedata, zoneDataLoading]);

  const {
    data: workersdata,
    isLoading: workerDataLoading,
    refetch: refetchWorkerData,
  } = useGet({
    key: "wdata",
    uri: `${BACKEND_URI}/admin/getworkers?${
      val != undefined &&
      val != "All Zones" &&
      `zoneAlloted=${val == "Not Alloted Zones" ? "na" : val}`
    }`,
    options: {
      refetchOnWindowFocus: true,
      refetchInterval: 10000,
    },
  });

  useEffect(() => {
    refetchWorkerData();
  }, [val, refetchWorkerData]);

  return (
    <Transition>
      <div className={classes.container}>
        <LoadingOverlay
          visible={zoneDataLoading || workerDataLoading}
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
          {`Zone Allocation`}
        </Title>
        <Select
          size="sm"
          radius="md"
          placeholder="Choose Zone to select"
          checkIconPosition="right"
          data={
            !zoneDataLoading && ["All Zones", "Not Alloted Zones", ...zones]
          }
          classNames={classes}
          value={val}
          onChange={setVal}
          filter={optionsFilter}
          nothingFoundMessage="Nothing found..."
          searchable={mobile ? false : true}
          clearable
        />
        <Grid grow mt={20} className={classes.gridDiv}>
          <AnimatePresence mode="popLayout">
            {!workerDataLoading && workersdata.length != 0 ? (
              workersdata.map((worker) => {
                return (
                  <Grid.Col key={worker._id} span={{ base: 12, sm: 6, lg: 4 }}>
                    <WorkerCard
                      key={`${worker._id}_${worker.zoneAlloted}`}
                      workerdata={worker}
                      childZones={!zoneDataLoading && zonedata.zones}
                    />
                  </Grid.Col>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.2 } }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className={classes.noWorkerDiv}
              >
                No Worker Found
              </motion.div>
            )}
          </AnimatePresence>
        </Grid>
      </div>
    </Transition>
  );
}
