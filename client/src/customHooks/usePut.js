import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const usePut = ({ key, uri, data, options }) => {
  const fetcher = async () => {
    const response = await axios.put(uri, data);
    return response.data;
  };

  return useMutation({
    mutationKey: [key],
    mutationFn: fetcher,
    ...options,
  });
};
