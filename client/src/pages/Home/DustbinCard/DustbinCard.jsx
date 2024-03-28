import { Text, Card, RingProgress, Group ,useMantineTheme} from "@mantine/core";
import classes from "./DustbinCard.module.css";
import { useMediaQuery } from "@mantine/hooks";


const stats = [
  { value: "Zone_ID", label: "Zone Number" },
  //   { value: 76, label: 'In progress' },
];

export function DustbinCard({data}) {

  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const percent = data.percentage;
  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text className={classes.label}>{stat.value}</Text>
      <Text size="sm" c="dimmed">
        {stat.label}
      </Text>
    </div>
  ));

  return (
    <Card withBorder p={mobile?"lg":"xl"} radius="md" className={classes.card}>
      <div className={classes.inner}>
        <div>
          {/* <Text fz="lg" className={classes.label}>
            {data.zone}
          </Text> */}
          <div>
            <Text className={classes.lead}>
              Zone Name
            </Text>
            <Text fz="sm" c="dimmed">
              {data.zone}
            </Text>
          </div>
          <div>
            <Text className={classes.lead} mt={30}>
              Dustbin ID
            </Text>
            <Text fz="sm" c="dimmed">
              {data.dustbinID}
            </Text>
          </div>
          {/* <Group mt="lg">{items}</Group> */}
        </div>

        <div className={classes.ring}>
          <RingProgress
            roundCaps
            thickness={6}
            size={120}
            sections={[{ value: percent, color: percent <= 45 ? "#8CE99A" : (percent <= 75 ? "yellow" : "red")}]}
            label={
              <div>
                <Text ta="center" fz="md" className={classes.label}>
                  {percent.toFixed(0)}%
                </Text>
                <Text ta="center" fz="sm" c="dimmed">
                  Filled
                </Text>
              </div>
            }
          />
        </div>
      </div>
    </Card>
  );
}
