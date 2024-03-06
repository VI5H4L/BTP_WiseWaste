
import {useBackButton} from "../customHooks/useBackButton"
  
export function NetworkError() {
  useBackButton("exit");
  return (
    <>
    Network not Available!
    </>
  );
}
