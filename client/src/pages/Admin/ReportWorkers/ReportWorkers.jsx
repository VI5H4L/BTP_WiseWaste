import {
  Title,
  useMantineTheme,
  Button,
  LoadingOverlay,
  NumberInput,
  Grid,
} from "@mantine/core";
import Transition from "../../../Transition";
import classes from "./ReportWorkers.module.css";
import { useMediaQuery } from "@mantine/hooks";
import { useGet } from "../../../customHooks/useGet";
import { useForm } from "@mantine/form";
import { usePut } from "../../../customHooks/usePut";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReportZoneCard } from "./ReportZoneCard/ReportZoneCard";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
const ReportWorkers = () => {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const form = useForm({
    initialValues: {
      dustbinFillThreshold: "",
      zoneFillThreshold: "",
    },

    validate: (values) => {
      const errors = {};

      if (
        !Number.isInteger(values.dustbinFillThreshold) ||
        values.dustbinFillThreshold < 0 ||
        values.dustbinFillThreshold > 100
      ) {
        errors.dustbinFillThreshold = "% must be an integer between 0 and 100";
      }
      if (
        !Number.isInteger(values.zoneFillThreshold) ||
        values.zoneFillThreshold < 0 ||
        values.zoneFillThreshold > 100
      ) {
        errors.zoneFillThreshold = "% must be an integer between 0 and 100";
      }

      return errors;
    },
  });

  const {
    data: thresholddata,
    isLoading: isThresholdDataLoading,
    refetch: refetchThresholdData,
  } = useGet({
    key: "getthresholds",
    uri: `${BACKEND_URI}/admin/reportworkers/getthresholds`,
    options: { refetchOnWindowFocus: true, refetchInterval: 10000 },
  });

  const {
    data: filledzonesdata,
    isLoading: isFilledZonesDataLoading,
    refetch: refetchFilledZonesData,
  } = useGet({
    key: "getzilledzones",
    uri: `${BACKEND_URI}/admin/reportworkers/getfilledzones`,
    options: { refetchOnWindowFocus: true, refetchInterval: 10000 },
  });
  useEffect(() => {
    if (!isFilledZonesDataLoading) {
      console.log(filledzonesdata);
    }
  }, [filledzonesdata, isFilledZonesDataLoading]);

  const { mutate: updateThresholds, isPending: IsUpdateThresholdsPending } =
    usePut({
      key: "setthresholds",
      uri: `${BACKEND_URI}/admin/reportworkers/setthresholds`,
      data: {
        dustbinFillThreshold: form.values.dustbinFillThreshold,
        zoneFillThreshold: form.values.zoneFillThreshold,
      },
      options: {
        onSuccess: () => {
          refetchThresholdData();
          refetchFilledZonesData();
        },
      },
    });

  return (
    <Transition>
      <div className={classes.container}>
        <LoadingOverlay
          visible={
            isThresholdDataLoading ||
            IsUpdateThresholdsPending ||
            isFilledZonesDataLoading
          }
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
          {"Report Workers"}
        </Title>

        <form
          onSubmit={form.onSubmit(() => {
            updateThresholds();
          })}
          className={classes.grp}
        >
          <NumberInput
            label="Dustbin fill Threshold (%)"
            allowDecimal={false}
            allowNegative={false}
            description={"Means a dustbin is considered filled if its filled above this Threshold"}
            placeholder={`Current Threshold: ${
              form.values.dustbinFillThreshold != ""
                ? form.values.dustbinFillThreshold
                : !isThresholdDataLoading
                ? thresholddata.dustbinFillThreshold
                : 80
            }`}
            size="sm"
            mb={16}
            required
            {...form.getInputProps("dustbinFillThreshold")}
            className={classes.input}
          />
          <NumberInput
            label="Zone fill Threshold (%)"
            description={"Means a zone is considered filled if % of dustbins filled in that zone is above this Threshold"}
            allowDecimal={false}
            allowNegative={false}
            placeholder={`Current Threshold: ${
              form.values.zoneFillThreshold != ""
                ? form.values.zoneFillThreshold
                : !isThresholdDataLoading
                ? thresholddata.zoneFillThreshold
                : 90
            }`}
            size="sm"
            mb={16}
            required
            {...form.getInputProps("zoneFillThreshold")}
            className={classes.input}
          />
          <Button
            fullWidth
            loading={isThresholdDataLoading || IsUpdateThresholdsPending || isFilledZonesDataLoading}
            size="sm"
            type="submit" // make this button submit the form
            id={classes.btn1}
          >
            Set Thresholds
          </Button>
        </form>

        <Title
          order={mobile ? 5 : 4}
          className={classes.title}
          ta="center"
          td="underline"
          mt={mobile ? 16 : 24}
          mb={mobile ? 24 : 32}
        >
          {"Filled Zones based on thresholds"}
        </Title>

        <Grid grow mt={20} className={classes.gridDiv}>
          <AnimatePresence mode="popLayout">
            {!isFilledZonesDataLoading &&
            filledzonesdata.filledZones.length != 0 ? (
              filledzonesdata.filledZones.map((zone, index) => {
                return (
                  <Grid.Col
                    key={`filledzone_${zone}_${index}`}
                    span={{ sm: 12, lg: 6 }}
                  >
                    {<ReportZoneCard zone={zone} zoneCounts={filledzonesdata.zoneCounts[zone]}  />}
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
                className={classes.noZoneDiv}
              >
                No Zone Filled
              </motion.div>
            )}
          </AnimatePresence>
        </Grid>
      </div>
    </Transition>
  );
};

export default ReportWorkers;
