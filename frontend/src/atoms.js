import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { OpenVidu } from "openvidu-browser";

const { persistAtom } = recoilPersist();
var OV = new OpenVidu();
var publisher = OV.initPublisher("F");

export const nicknameState = atom({
  key: "nickname",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const isLoginState = atom({
  key: "isLogin",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const userIdState = atom({
  key: "userId",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const createProjectIdState = atom({
  key: "projectId",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const createRewardIdState = atom({
  key: "rewardId",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

// jwt token 가져다 쓰기 => headers: setAuthorizationToken(),
export default function setAuthorizationToken() {
  const token = localStorage.getItem("auth-token");
  const config = {
    Authorization: `${token}`,
  };
  return config;
}

export function setAuthorizationEmailToken(token) {
  const config = {
    Authorization: `${token}`,
  };
  return config;
}

export function comma(str){
  str = String(str);
  return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}


export const asdf = atom({
  key: "asdfId",
  default: publisher,
});