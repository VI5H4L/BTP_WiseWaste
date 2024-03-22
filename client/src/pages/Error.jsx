import Transition from "../Transition";
import { useBackButton } from "../customHooks/useBackButton";

export function Error() {
  useBackButton("/");
  return <Transition>Error 404</Transition>;
}
