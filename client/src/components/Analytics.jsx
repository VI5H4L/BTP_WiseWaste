
import {useBackButton} from "../customHooks/useBackButton"
import { useRecoilState } from "recoil";
import { textState } from "../Recoil/recoil_state";
import Transition from "../Transition";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
export function Analytics() {
  useBackButton("/");

  // const [val,setVal] = useRecoilState(textState);
  // setVal("Analytics")

  const fetcher = async ()=>{
    const uri = "https://catfact.ninja/fact";
      const response = await axios.get(uri);
      console.log(response.data);
      return response.data
  }
  const { isLoading, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: fetcher,
    refetchOnWindowFocus: true,
    refetchInterval: 6000,
  })

  return (
    <Transition>
    {!isLoading && data.fact}
    </Transition>
  );
}
