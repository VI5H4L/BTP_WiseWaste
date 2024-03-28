import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useDelete = ({ key, uri, options }) => {
  const fetcher = async () => {
    const response = await axios({
      method: "delete",
      url: uri,
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
