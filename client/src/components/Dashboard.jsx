
  import {useBackButton} from "../customHooks/useBackButton"
import Transition from "../Transition";

  
  export function Dashboard() {
    useBackButton("/");
    return (
      <Transition>
      DashBoard
      </Transition>
    );
  }
  