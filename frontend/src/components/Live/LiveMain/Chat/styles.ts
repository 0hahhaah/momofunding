import { IonIcon } from "@ionic/react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  MomoColor,
  MomoStrongColor,
  MomoWeakColor,
} from "../../../../shared/global";
import { StyledLink } from "../../../Home/HomeFundings/HomeFundingCard/styles";
import { TextAreaWrapper } from "../../../ProjectDetail/ProjectContent/ProjectCommunity/PjCommunityQnA/PjCommunityInput/styles";

export const ChatWrapper = styled.div`
  min-width: 300px;
  margin: 15px;
  margin-top: 40px;
  width: 35%;
  color: #ffffffce;
  height: 78%;
  right: 0px;
  bottom: 75px;
  position: absolute;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
`;

export const ChatBody = styled.div`
  overflow: scroll;
  width: 100%;
  height: 100%;
  background: var(--transparentLightGradient);
  color: #ffffffce;
  position: relative;
  border-radius: 6px;
  padding: 5px 0px;
  margin-top: 5px;
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
`;

export const ChatHeader = styled.header`
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 20px;
  position: sticky;
  background: var(--primaryGradient);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;
export const ChatFooter = styled.form`
  padding: 10px 15px;
  display: flex;
  align-items: center;
  font-size: 20px;
  position: sticky;
  background: var(--primaryGradient);
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
`;

export const ChatIcon = styled(IonIcon)`
  font-size: 30px;
  margin: 3px;
`;

export const MessageBox = styled.div`
  align-self: flex-end;
  padding: 6px 18px;
  border-radius: 24px;
  border-bottom-right-radius: 0px;
  background: var(--primary);
  font-size: 15px;
  font-weight: 400;
  margin: 7px;
  max-width: 65%;
  box-shadow: var(--secondaryBoxShadow);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const NickName = styled.span`
  font-weight: 300;
  font-size: 12px;
  color: ${MomoWeakColor};
`;

export const ChatTypingArea = styled(TextAreaWrapper)`
  border-radius: 5px;
  padding: 3px 10px;
  height: 36px;
  background: var(--transparentLightGradient);
  margin: 3px;
  margin-right: 20px;
`;

export const ChatButton = styled.button`
  border: none;
  background: none;
  display: flex;
  width: 45px;
  height: 45px;
  border-radius: 100%;
`;

export const LiveBtnRound = styled.button`
  display: flex;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  position: absolute;
  bottom: 20px;
  right: 25px;
  box-shadow: var(--secondaryBoxShadow);
`;

export const LiveBtnRoundDanger = styled(LiveBtnRound)`
  background: tomato;
  left: 45%;
`;

export const ImageForBg = styled.img`
  position: absolute;
  top: -9999px;
  bottom: -9999px;
  left: -9999px;
  right: -9999px;
  height: 100%;
  margin: auto;
`;

export const ProjectBtn = styled(ChatButton)`
  overflow: hidden;
  position: relative;
  width: 60px;
  height: 60px;
`;

export const ChatTop = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-start;
  margin-bottom: 3px;
`;

export const ProjectLink = styled(Link)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  border-radius: 12px;
  padding: 8px;
  background: ${MomoColor};
  margin: 3px 8px;
  box-shadow: var(--secondaryBoxShadow);
  :hover {
    background: ${MomoStrongColor};
  }
`;

export const ProjectText = styled.span`
  width: 60%;
  text-align: center;
  flex-direction: column;
`;