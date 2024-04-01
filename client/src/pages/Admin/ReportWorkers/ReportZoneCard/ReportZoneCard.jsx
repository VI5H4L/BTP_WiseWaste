import { Avatar, Text, Group, Card } from "@mantine/core";
import { IconPhoneCall, IconAt } from "@tabler/icons-react";
import classes from "./ReportZoneCard.module.css";
import { motion } from "framer-motion";
// const mobile = window.screen.width < 768;

export function ReportZoneCard({ zone }) {

  function getInitials(fullName) {
    return fullName
      .split(" ")
      .filter((name) => name.length > 0) // filter out empty strings
      .map((name) => name[0].toUpperCase())
      .join("");
  }

  const handleReportClick =()=>{
    alert(`Reported ${zone}`)
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
            
          </div>
          <div onClick={handleReportClick} className={classes.rightDiv}>
            <Text fz="md" fw={700} className={classes.name}>
              {"Report"}
            </Text>
          </div>
        </Group>
      </Card>
    </motion.div>
  );
}
