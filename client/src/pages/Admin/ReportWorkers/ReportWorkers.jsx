import {
  Title,
  useMantineTheme,
  Button,
  LoadingOverlay,
  NumberInput,
} from "@mantine/core";
import Transition from "../../../Transition";
import classes from "./ReportWorkers.module.css";
import { useMediaQuery } from "@mantine/hooks";
import { useGet } from "../../../customHooks/useGet";
import { useForm } from "@mantine/form";
import { usePut } from "../../../customHooks/usePut";

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

  const { data: thresholddata, isLoading: isThresholdDataLoading,refetch:refetchThresholdData } = useGet({
    key: "getthresholds",
    uri: `${BACKEND_URI}/admin/reportworkers/getthresholds`,
    options: { refetchOnWindowFocus: true, refetchInterval: 10000 },
  });

  const {
    mutate: updateThresholds,
    isPending: IsUpdateThresholdsPending,
  } = usePut({
    key: "setthresholds",
    uri: `${BACKEND_URI}/admin/reportworkers/setthresholds`,
    data: {dustbinFillThreshold : form.values.dustbinFillThreshold ,zoneFillThreshold: form.values.zoneFillThreshold},
    options: {
      onSuccess: () => {
        refetchThresholdData();
      },
    },
  });

  return (
    <Transition>
      <div className={classes.container}>
        <LoadingOverlay
          visible={false &&( isThresholdDataLoading || IsUpdateThresholdsPending)}
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
            placeholder={`Current Threshold: ${
              form.values.dustbinFillThreshold!=""?form.values.dustbinFillThreshold:(!isThresholdDataLoading?thresholddata.dustbinFillThreshold : 80)
            }`}
            size="sm"
            mb={16}
            required
            {...form.getInputProps("dustbinFillThreshold")}
            className={classes.input}
          />
          <NumberInput
            label="Zone fill Threshold (%)"
            placeholder={`Current Threshold: ${
              form.values.zoneFillThreshold!=""?form.values.zoneFillThreshold:(!isThresholdDataLoading?thresholddata.zoneFillThreshold : 90)
            }`}
            size="sm"
            mb={16}
            required
            {...form.getInputProps("zoneFillThreshold")}
            className={classes.input}
          />
          <Button
            fullWidth
            loading={isThresholdDataLoading || IsUpdateThresholdsPending}
            size="sm"
            type="submit" // make this button submit the form
            id={classes.btn1}
          >
            Set Thresholds
          </Button>
        </form>

      </div>
    </Transition>
  );
};

export default ReportWorkers;
