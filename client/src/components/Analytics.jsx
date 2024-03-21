import { useBackButton } from "../customHooks/useBackButton";
import { useGet } from "../customHooks/useGet";
// import { useRecoilState } from "recoil";
// import { textState } from "../Recoil/recoil_state";
import Transition from "../Transition";
import { LoadingOverlay } from "@mantine/core";

export function Analytics() {
  useBackButton("/");

  // const [val,setVal] = useRecoilState(textState);
  // setVal("Analytics")

  const { data, isLoading } = useGet({
    key: "fact",
    uri: "https://catfact.ninja/fact",
    options: { refetchOnWindowFocus: true, refetchInterval: 6000 },
  });

  return (
    <Transition>
      <div style={{ position: "relative", minHeight: "100svh" }}>
        <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          transitionProps={{ transition: "fade", duration: "500" }}
          loaderProps={{ color: "#8CE99A", type: "bars" }}
          overlayProps={{
            radius: "sm",
            color: "#1f1f1f",
            backgroundOpacity: "0.8",
            blur: "1",
          }}
        />
        {!isLoading && data.fact}
      </div>
    </Transition>
  );
}
