import { useBackButton } from "../../customHooks/useBackButton";
import { Grid, Title, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import classes from "./Home.module.css";
import { DustbinCard } from "./DustbinCard/DustbinCard";
import Transition from "../../Transition";
import { LoadingOverlay } from "@mantine/core";

const child = <DustbinCard />;

export function Home() {
  useBackButton("exit");

  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return (
    <Transition>
      <div className={classes.container}>
        <LoadingOverlay
          visible={false}
          zIndex={1000}
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
          {`Dustbin Data Status`}
        </Title>
        <Grid grow>
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
