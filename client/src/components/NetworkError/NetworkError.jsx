import { useBackButton } from "../../customHooks/useBackButton";
import classes from "./NetworkError.module.css";

export function NetworkError() {
  useBackButton("exit");
  return (
    <div className={classes.mainDiv}>
      <div className={classes.loader}>
        <div className={classes.loaderbar}></div>
        <div className={classes.loaderbar}></div>
        <div className={classes.loaderbar}></div>
        <div className={classes.loaderbar}></div>
        <div className={classes.loaderbar}></div>
        <div className={classes.loaderball}></div>
      </div>
      <p>Network Not Available!!</p>
    </div>
  );
}
