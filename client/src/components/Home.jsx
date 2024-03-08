import {useBackButton} from "../customHooks/useBackButton"
export function Home() {
  useBackButton("/");
  
  return (
    <>
    Home
    </>
  );
}
