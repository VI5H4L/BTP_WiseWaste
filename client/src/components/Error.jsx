
import {useBackButton} from "../customHooks/useBackButton"
  
export function Error() {
  useBackButton("/");
  return (
    <>
    Error 404
    </>
  );
}
