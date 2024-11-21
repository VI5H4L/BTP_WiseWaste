import { useBackButton } from "../../customHooks/useBackButton";
import { Grid, Title, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import classes from "./Home.module.css";
import { DustbinCard } from "./DustbinCard/DustbinCard";
import Transition from "../../Transition";
import { LoadingOverlay } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import { useGet } from "../../customHooks/useGet";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

export function Home() {
  useBackButton("exit");

  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const { data: dustbinData, isLoading: dustbinDataLoading } = useGet({
    key: "dustbindata",
    uri: `${BACKEND_URI}/dustbin/status`,
    options: { refetchOnWindowFocus: true, refetchInterval: 5000 },
  });

  return (
    <Transition>
      <div className={classes.container}>
        <LoadingOverlay
          visible={dustbinDataLoading}
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

        <Grid grow className={classes.gridDiv}>
          <AnimatePresence mode="popLayout">
            {!dustbinDataLoading && dustbinData.length != 0 ? (
              dustbinData.map((dustbin) => {
                return (
                  <Grid.Col key={dustbin._id} span={{ base: 12, sm: 6, lg: 4 }}>
                    <DustbinCard data={dustbin}/>
                  </Grid.Col>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.2 } }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className={classes.noDustbinDiv}
              >
                No Dustbins Found
              </motion.div>
            )}
          </AnimatePresence>
        </Grid>

      </div>
    </Transition>
  );
}
