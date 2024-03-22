import { Text, Card, RingProgress, Group } from "@mantine/core";
import classes from "./DustbinCard.module.css";

const stats = [
  { value: "Zone_ID", label: "Zone Number" },
  //   { value: 76, label: 'In progress' },
];

export function DustbinCard() {
  const percent = 40;
  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text className={classes.label}>{stat.value}</Text>
      <Text size="sm" c="dimmed">
        {stat.label}
      </Text>
    </div>
  ));

  return (
      <Card withBorder p="xl" radius="md" className={classes.card}>
        <div className={classes.inner}>
          <div>
            <Text fz="xl" className={classes.label}>
              ZoneName
            </Text>
            <div>
              <Text className={classes.lead} mt={30}>
                Dustbin_ID
              </Text>
              <Text fz="sm" c="dimmed">
                Identity number
              </Text>
            </div>
            {/* <Group mt="lg">{items}</Group> */}
          </div>

          <div className={classes.ring}>
            <RingProgress
              roundCaps
              thickness={6}
              size={120}
              sections={[
                { value: percent, color: "#8CE99A" },
              ]}
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
