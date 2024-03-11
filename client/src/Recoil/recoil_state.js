import { atom } from "recoil";

const textState = atom({
  key: "textState",
  default: "Analytics"
});
const isNetworkErrorState = atom({
  key: "isNetworkErrorState",
  default: false
});

export {
  textState,
  isNetworkErrorState
};
