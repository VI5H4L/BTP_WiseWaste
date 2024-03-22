import { useBackButton } from "../../customHooks/useBackButton";
import classes from "./NetworkError.module.css";

export function NetworkError() {
  useBackButton("exit");
  return (
    <div className={classes.mainDiv}>
      <img src="./images/dragon.svg" alt="img" />
      <p>Network Not Available!!</p>
    </div>
  );
}
