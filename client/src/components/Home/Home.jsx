import {useBackButton} from "../../customHooks/useBackButton"
import { Grid } from '@mantine/core';
import classes from "./Home.module.css"
import { DustbinCard } from "./DustbinCard/DustbinCard";

const child = <DustbinCard />

export function Home() {
  useBackButton("exit");
  return (
    <div className={classes.container}>
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6 ,lg:4 }}>{child}</Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 ,lg:4 }}>{child}</Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 ,lg:4 }}>{child}</Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 ,lg:4 }}>{child}</Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 ,lg:4 }}>{child}</Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 ,lg:4 }}>{child}</Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 ,lg:4 }}>{child}</Grid.Col>
      </Grid>
    </div>
  );
}