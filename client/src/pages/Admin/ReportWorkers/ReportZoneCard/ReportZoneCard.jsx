import { Avatar, Text, Group, Card, Loader } from "@mantine/core";
import classes from "./ReportZoneCard.module.css";
import { usePost } from "../../../../customHooks/usePost";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { notifications } from "@mantine/notifications";
// const mobile = window.screen.width < 768;

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
export function ReportZoneCard({ zone,zoneCounts }) {

  const { mutate: reportWorkers, isError,error,isPending: IsReportWorkersPending } =
  usePost({
    key: "reportworkers",
    uri: `${BACKEND_URI}/admin/reportworkers`,
    data: {
      zone
    },
    options: {
      onSuccess: () => {
        notifications.show({
          title: "Workers Reported Successfully",
          message: `Reported All Workers of ${zone}`,
          color: "var(--mantine-secondary-color-body)",
          withBorder: "true",
        });
      },
    },
  });
  useEffect(() => {
    if(!IsReportWorkersPending){
      if(isError){
        if(error.response.status ==404 && error.response.data.message ==`No workers are allotted to zone ${zone}`){
          notifications.show({
            title: "Cannot Report",
            message: `No workers are allotted to ${zone}`,
            color: "red",
            withBorder: "true",
          });
        }
        else{ console.log(error);
          notifications.show({
            title: "Server Error Occured",
            message: `Reporting Failed!`,
            color: "red",
            withBorder: "true",
          });
        }
      }
    }
  }, [IsReportWorkersPending,zone,isError,error])
  

  function getInitials(fullName) {
    return fullName
      .split(" ")
      .filter((name) => name.length > 0) // filter out empty strings
      .map((name) => name[0].toUpperCase())
      .join("");
  }

  const handleReportClick =()=>{
    reportWorkers();
  };
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
            <Avatar color="green" radius="md" size={50}>
              {getInitials(zone)}
            </Avatar>
          </div>
          <div className={classes.midDiv}>
            <Text fz="md" fw={700} className={classes.name}>
              {zone}
            </Text>

            <Group wrap="nowrap" gap={10} mt={3}>
              <Text
                fz="sm"
                c="dimmed"
              >
                {`${zone} is ${zoneCounts.percentageFilled}% filled`}
              </Text>
            </Group>
            
          </div>
          <div onClick={handleReportClick} className={classes.rightDiv}>
            {IsReportWorkersPending?<Loader size={24} type="dots" color="var(--mantine-secondary-color-body)"/> :
            <Text fz="md" fw={700} className={classes.name}>
              {"Report"}
            </Text>}
          </div>
        </Group>
      </Card>
    </motion.div>
  );
}
