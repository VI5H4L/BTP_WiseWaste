
import {useBackButton} from "../customHooks/useBackButton"
import { useRecoilState } from "recoil";
import { textState } from "../Recoil/recoil_state";
import Transition from "../Transition";

export function Analytics() {
  useBackButton("/");

  const [val,setVal] = useRecoilState(textState);
  
  setVal("Analytics")
  return (
    <Transition>
    {val}
    </Transition>
  );
}
