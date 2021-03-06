import { atom } from "recoil";
import { OpenVidu } from "openvidu-browser";
var OV = new OpenVidu();

export const pjtIdState = atom({
  key: "projectIdState",
  default: -1,
});

export const micState = atom({
  key: "micActive",
  default: true,
});

export const camState = atom({
  key: "camActive",
  default: true,
});

export const audioState = atom({
  key: "audioActive",
  default: true,
});

export const titleState = atom({
  key: "titleState",
  default: "",
});

export const msgState = atom({
  key: "msgState",
  default: "",
});

type MessageProps = {
  nickname: string;
  message: string;
}[];

export const msgsState = atom({
  key: "msgsState",
  default: [] as MessageProps,
});

export const sessionState = atom({
  key: "sessionState",
  default: OV.initSession(),
  dangerouslyAllowMutability: true,
});

export const viewrsCntState = atom({
  key: "viewrsCntState",
  default: 0,
});
