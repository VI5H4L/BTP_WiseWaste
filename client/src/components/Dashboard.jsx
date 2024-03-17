import Transition from "../Transition";
import { useBackButton } from "../customHooks/useBackButton";

export function Dashboard() {
  useBackButton("/");
  return (
  <Transition>
    DashBoard
    </Transition>
    );
}
