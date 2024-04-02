import { useState, useEffect } from "react";
import {
  Title,
  useMantineTheme,
  Button,
  TextInput,
  LoadingOverlay,
  Select,
  NumberInput,
  Grid,
} from "@mantine/core";
import Transition from "../../../Transition";
import classes from "./Simulation.module.css";
import { useMediaQuery } from "@mantine/hooks";
import { useGet } from "../../../customHooks/useGet";
import { usePost } from "../../../customHooks/usePost";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import { motion, AnimatePresence } from "framer-motion";
import { SimulationCard } from "./SimulationCard/SimulationCard";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
const Simulation = () => {
  const queryClient = useQueryClient();

  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const [dustbinData, setDustbinData] = useState({});

  const form = useForm({
    initialValues: {
      dustbinID: "",
      percentage: "",
      zone: "",
    },

    validate: (values) => {
      const errors = {};

      if (values.dustbinID.length > 6) {
        errors.dustbinID = "Dustbin ID must be 6 characters or less";
      }

      if (
        !Number.isInteger(values.percentage) ||
        values.percentage < 0 ||
        values.percentage > 100
      ) {
        errors.percentage = "% must be an integer between 0 and 100";
      }

      if (!values.zone) {
        errors.zone = "You must select a zone";
      }

      return errors;
    },
  });

  const { data: zonedata, isLoading: isZoneDataLoading } = useGet({
    key: "managezone",
    uri: `${BACKEND_URI}/admin/managezoneget`,
    options: { refetchOnWindowFocus: true, refetchInterval: 10000 },
  });

  const {
    data: simulationdata,
    isLoading: isgetDataLoading,
    refetch,
  } = useGet({
    key: "simulationget",
    uri: `${BACKEND_URI}/admin/simulation`,
    options: { refetchOnWindowFocus: true, refetchInterval: 10000 },
  });

  const {
    mutate: postData,
    isPending: isPostingPending,
    isError,
    error,
  } = usePost({
    key: "simulationpost",
    uri: `${BACKEND_URI}/admin/simulation`,
    data: dustbinData,
    options: {
      onSuccess: () => {
        refetch();
        queryClient.invalidateQueries("dustbindata");
      },
    },
  });

  useEffect(() => {
    if (!isPostingPending && isError) {
      if (
        error.response.status == 400 &&
        error.response.data.message == "A dustbin with this ID already exists"
      ) {
        form.setFieldError("dustbinID", "Enter Unique ID! Try again");
      }
    }
  }, [isError, error, form, isPostingPending]);

  const handleAddZone = (values) => {
    setDustbinData(values);
    postData();
  };

  return (
    <Transition>
      <div className={classes.container}>
        <LoadingOverlay
          visible={isgetDataLoading || isZoneDataLoading}
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
          Simulation
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            handleAddZone(values);
          })}
          className={classes.grp}
        >
          <TextInput
          label="Enter unique Dustbin ID"
          description="Each dustbin should have an unique ID"
          required
            placeholder="DUSID1"
            size="sm"
            mb={16}
            {...form.getInputProps("dustbinID")}
            className={classes.input}
          />
          <NumberInput
          label="Enter Dustbin's filled %"
            placeholder="x%"
            allowDecimal={false}
            allowNegative={false}
            size="sm"
            mb={16}
            required
            {...form.getInputProps("percentage")}
            className={classes.input}
          />
          <Select
            size="sm"
            radius="sm"
            label="Choose Dustbin's zone"
            placeholder="Click to choose"
            checkIconPosition="right"
            data={!isZoneDataLoading && zonedata.zones}
            mb={16}
            required
            {...form.getInputProps("zone")}
            className={classes.input}
            nothingFoundMessage="Nothing found..."
            clearable
          />
          <Button
            fullWidth
            loading={isgetDataLoading || isPostingPending}
            size="sm"
            type="submit"
            id={classes.btn1}
          >
            Add Dustbin
          </Button>
        </form>

        <Grid grow mt={20} className={classes.gridDiv}>
          <AnimatePresence mode="popLayout">
            {!isgetDataLoading && simulationdata.length != 0 ? (
              simulationdata.map((dustbindata) => {
                return (
                  <Grid.Col
                    key={dustbindata.dustbinID}
                    span={{ sm: 12, lg: 6 }}
                  >
                    {
                      <SimulationCard
                        dustbindata={dustbindata}
                        refetch={refetch}
                      />
                    }
                  </Grid.Col>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.2 } }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={{ whiteSpace: "nowrap" }}
                className={classes.noDustbinDiv}
              >
                No Dustbins
              </motion.div>
            )}
          </AnimatePresence>
        </Grid>
      </div>
    </Transition>
  );
};

export default Simulation;
