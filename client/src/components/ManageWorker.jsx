import Transition from "../Transition";
import { SegmentedControl } from "@mantine/core";
import { useBackButton } from "../customHooks/useBackButton";
import classes from "./ManageWorker.module.css"

export function ManageWorker() {
  useBackButton("/");
  return (
    <Transition>
        <div className={classes.container}>
      <SegmentedControl
        // fullWidth
        radius="md"
        size="md"
        data={["All", "AI/ML", "C++", "Rust", "TypeScript"]}
        classNames={classes}
      />
      </div>
    </Transition>
  );
}
