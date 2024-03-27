import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const usePut = ({ key, uri, data, options }) => {
  const fetcher = async () => {
    const response = await axios({
      method: "put",
      url: uri,
      data: data,
      withCredentials: true,
    });
    return response.data;
  };

  return useMutation({
    mutationKey: [key],
    mutationFn: fetcher,
    ...options,
  });
};
