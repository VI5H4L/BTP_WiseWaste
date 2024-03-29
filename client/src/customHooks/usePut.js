import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { roleState, userDataState } from "../Recoil/recoil_state";
import { notifications } from "@mantine/notifications";

export const usePut = ({ key, uri, data, options }) => {
  const navigate = useNavigate();

  const setRole = useSetRecoilState(roleState);
  const setUserData = useSetRecoilState(userDataState);

  const fetcher = async () => {
    try {
      const response = await axios({
        method: "put",
        url: uri,
        data: data,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      if (
        error.response.status == 401 &&
        error.response.data.message == "Token Error"
      ) {
        console.log("====================================");
        console.log("Token Error!Session expired");
        console.log("====================================");
        const handleLogout = () => {
          if (localStorage.getItem("role")) {
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userID");
            localStorage.removeItem("fullData");
            localStorage.removeItem("role");
            setRole("user");
            setUserData({});
            notifications.show({
              title: "Session Expired!",
              message: "Please Login again!!",
              color: "red",
              withBorder: "true",
            });
            navigate("/login");
          }
        };
        handleLogout();
      }
      throw error;
    }
  };

  return useMutation({
    mutationKey: [key],
    mutationFn: fetcher,
    ...options,
  });
};
