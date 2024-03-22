import Transition from "../../../Transition";
import { Title, Select, Grid,LoadingOverlay } from "@mantine/core";
// import { useMediaQuery } from "@mantine/hooks";
import { useBackButton } from "../../../customHooks/useBackButton";
import classes from "./ZoneAllocation.module.css";
import { useState, useEffect } from "react";
import { WorkerCard } from "./WorkerCard/WorkerCard";
import { useGet } from "../../../customHooks/useGet";

const child = <WorkerCard />;

const mobile = window.screen.width < 768;
const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
export function ZoneAllocation() {
  useBackButton("/");

  const [zones,setZones]= useState([]);
  const [value, setValue] = useState("");

  const optionsFilter = ({ options, search }) => {
    const filtered = options.filter((option) =>
      option.label.toLowerCase().trim().includes(search.toLowerCase().trim())
    );

    // filtered.sort((a, b) => a.label.localeCompare(b.label));
    return filtered;
  };

  const {data: zonedata,isLoading} = useGet({
    key: "managezone",
    uri: `${BACKEND_URI}/admin/managezone`,
    options: { refetchOnWindowFocus: true, refetchInterval: 6000 },
  });
  useEffect(() => {
    if (!isLoading) {
      setZones(zonedata.zones);
    }
  }, [zones,zonedata,isLoading]);

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
          {`Zone Allocation`}
        </Title>
        <Select
          size="md"
          radius="md"
          placeholder="Choose Zone to select"
          checkIconPosition="right"
          data={!isLoading && ["All Zones","Not Alloted Zones",...zones]}
          classNames={classes}
          value={value}
          onChange={setValue}
          filter={optionsFilter}
          nothingFoundMessage="Nothing found..."
          searchable={mobile?false:true}
          clearable
        />
        <Grid grow mt={20}>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>{child}</Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>{child}</Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>{child}</Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>{child}</Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>{child}</Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>{child}</Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>{child}</Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>{child}</Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>{child}</Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>{child}</Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>{child}</Grid.Col>
        </Grid>
      </div>
    </Transition>
  );
}
