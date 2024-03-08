import {useBackButton} from "../customHooks/useBackButton"
import AppUrlListener from "../Listeners/AppUrlListener"
export function Home() {
  useBackButton("/");
  
  return (
    <>
    <AppUrlListener />
    Home
    </>
  );
}
