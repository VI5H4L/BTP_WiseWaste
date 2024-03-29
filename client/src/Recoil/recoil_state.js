import { atom } from "recoil";

export const textState = atom({
  key: "textState",
  default: "Analytics"
});
export const roleState = atom({
  key: "roleState",
  default: "user"
});
export const userDataState = atom({
  key: "userDataState",
  default: {}
});
export const isNetworkErrorState = atom({
  key: "isNetworkErrorState",
  default: false
});