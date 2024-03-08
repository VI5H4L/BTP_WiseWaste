
import {useBackButton} from "../customHooks/useBackButton"
import { useRecoilValue } from "recoil";
import { textState } from "../Recoil/recoil_state";
export function Analytics() {
  useBackButton("/");

  const val = useRecoilValue(textState);
  
  return (
    <>
    {val}
    </>
  );
}
