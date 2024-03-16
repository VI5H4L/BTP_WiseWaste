
import {useBackButton} from "../customHooks/useBackButton"
import { useRecoilValue } from "recoil";
import { textState } from "../Recoil/recoil_state";
import Transition from "../Transition";

export function Analytics() {
  useBackButton("/");

  const val = useRecoilValue(textState);
  
  return (
    <Transition>
    {val}
    </Transition>
  );
}
