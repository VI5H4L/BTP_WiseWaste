import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const usePost = ({ key, uri, data, options }) => {
  const fetcher = async () => {
    const response = await axios.post(uri, data);
    return response.data;
  };

  return useMutation({
    mutationKey: [key],
    mutationFn: fetcher,
    ...options,
  });
};
