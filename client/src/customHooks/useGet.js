import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGet = ({ key, uri, options }) => {
  const fetcher = async () => {
    const response = await axios.get(uri);
    // console.log(response.data);
    return response.data;
  };

  return useQuery({
    queryKey: [key],
    queryFn: fetcher,
    ...options,
  });
};
