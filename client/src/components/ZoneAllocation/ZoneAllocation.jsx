import Transition from "../../Transition";
import { Title, Select, Grid } from "@mantine/core";
// import { useMediaQuery } from "@mantine/hooks";
import { useBackButton } from "../../customHooks/useBackButton";
import classes from "./ZoneAllocation.module.css";
import { useState } from "react";
import { WorkerCard } from "./WorkerCard/WorkerCard";

const child = <WorkerCard />;

const mobile = window.screen.width < 768;

export function ManageWorker() {
  useBackButton("/");

  // const theme = useMantineTheme();
  // const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const data = ["Zone A", "Zone D", "Zone C", "Zone B"];
  const [value, setValue] = useState("");

  const optionsFilter = ({ options, search }) => {
    const filtered = options.filter((option) =>
      option.label.toLowerCase().trim().includes(search.toLowerCase().trim())
    );

    filtered.sort((a, b) => a.label.localeCompare(b.label));
    return filtered;
  };

  return (
    <Transition>
      <div className={classes.container}>
        <Title
          order={mobile ? 3 : 2}
          className={classes.title}
          ta="center"
          mt={mobile ? 16 : 24}
          mb={mobile ? 32 : 48}
        >
          {`Worker Allocation:`}
        </Title>
        <Select
          size="md"
          radius="md"
          placeholder="Choose Zone to select"
          checkIconPosition="right"
          data={data}
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
