import {
  ButtonIconActive,
  Dashboard,
  DashboardContent,
  DashBoardFooter,
  DashboardHeader,
  DashboardInput,
  DashBoardInputBox,
  DashBoardTextArea,
  Switch,
  RendererWrapper,
  WeakSwitch,
  ButtonIconInactive,
  TestVideoWrapper,
  SubmitBtn,
} from "./styles";
import {
  videocamOutline,
  micOutline,
  videocamOffOutline,
  micOffOutline,
} from "ionicons/icons";
import ImageUploader from "../../../ImageUploader/ImageUploader";
import { OpenVidu } from "openvidu-browser";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  audioState,
  camState,
  micState,
  msgsState,
  pjtIdState,
  sessionState,
  titleState,
  viewrsCntState,
} from "../../LiveAtoms";
import {
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { baseUrl } from "../../../../App";
import LiveMain from "../../LiveMain";
import setAuthorizationToken, { userIdState } from "../../../../atoms";
import { SelectedSurveyState } from "../../LiveMain/Surveys/SurveyList/SurveyList";
import { Link, useParams } from "react-router-dom";
import { authorizationState, surveySubmitState } from "../../LiveMain/LiveMain";

const OPENVIDU_SERVER_URL = "https://i6a202.p.ssafy.io:4431";
const OPENVIDU_SERVER_SECRET = "9793";

function randomString() {
  return Math.random().toString(36).slice(2);
}

const sessionIdSelector = selector({
  key: "sessionId",
  get: ({ get }) => {
    const id = get(userIdState);
    return randomString(id);
  },
});

const sessionType = {
  on: () => {},
  disconnect: () => {},
};

const subType = {
  subscribeToAudio: () => {},
};

const pubType = {
  publishVideo: () => true,
  publishAudio: () => true,
};

const msgType = {
  nickname: "",
  message: "",
};

export const RTCRenderer = () => {
  const [camOn, setCamActive] = useRecoilState(camState);
  const [micOn, setMicActive] = useRecoilState(micState);
  const [publisher, setPublisher] = useState(pubType);
  const [subscriber, setSubscriber] = useState(subType);
  const [message, setMessage] = useState(msgType);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [title, setTitle] = useRecoilState(titleState);
  const [content, setContent] = useState("");
  const [messages, setMessages] = useRecoilState(msgsState);
  const [sessionIdToServer, setSessionId] = useState("");
  const [pjtId, setProjectId] = useRecoilState(pjtIdState);
  const [liveId, setLiveID] = useState("default");
  const [audioOn, setAudioActive] = useRecoilState(audioState);
  const setIsStaff = useSetRecoilState(authorizationState);
  const setSession = useSetRecoilState(sessionState);
  const setCurSurvey = useSetRecoilState(SelectedSurveyState);
  const setSurveySubmit = useSetRecoilState(surveySubmitState);
  const [viewerCnt, setViewerCnt] = useRecoilState(viewrsCntState);

  let session = sessionType;
  let isCreated = false;
  let sessionId;

  const params = useParams();
  const userSideSessionId = params.sessionId;
  const projectId = params.projectId;
  const staffSideSessionId = useRecoilValue(sessionIdSelector);

  const onCamClick = () => {
    setCamActive((now) => !now);
  };
  const onMicClick = () => {
    setMicActive((now) => !now);
  };

  const toggleCam = () => {
    publisher.publishVideo(camOn);
  };
  const toggleMic = () => {
    publisher.publishAudio(micOn);
  };
  const toggleAudio = () => {
    subscriber.subscribeToAudio(audioOn);
  };

  const createSession = (sessionId) => {
    console.log("create session. id:", sessionId);
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({ customSessionId: sessionId });
      axios
        .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions", data, {
          headers: {
            Authorization:
              "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setSurveySubmit(true);
          resolve(response.data.id);
        })
        .catch((response) => {
          var error = Object.assign({}, response);
          if (error?.response?.status === 409) {
            isCreated = true;
            setIsStaff(false);
            setIsSubmitted(true);
            resolve(sessionId);
          } else {
            console.log(error);
            console.warn(
              "No connection to OpenVidu Server. This may be a certificate error at " +
                OPENVIDU_SERVER_URL
            );
            if (
              window.confirm(
                'No connection to OpenVidu Server. This may be a certificate error at "' +
                  OPENVIDU_SERVER_URL +
                  '"\n\nClick OK to navigate and accept it. ' +
                  'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                  OPENVIDU_SERVER_URL +
                  '"'
              )
            ) {
              window.location.assign(
                OPENVIDU_SERVER_URL + "/accept-certificate"
              );
            }
          }
        });
    });
  };

  const createToken = (sessionId) => {
    const jsonBody = {};
    return new Promise((resolve, reject) => {
      var data = {};
      axios
        .post(
          OPENVIDU_SERVER_URL +
            "/openvidu/api/sessions/" +
            sessionId +
            "/connection",
          JSON.stringify(jsonBody),
          {
            headers: {
              Authorization:
                "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          // console.log("TOKEN", response);
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  };

  const getToken = (mySessionId) => {
    return createSession(mySessionId).then((sessionId) =>
      createToken(sessionId)
    );
  };

  const joinSession = () => {
    const OV = new OpenVidu();
    session = OV.initSession();

    session.on("streamCreated", function (event) {
      // console.log("stream started");
      const subscriber = session.subscribe(event.stream, "creatorVideo");
      setSubscriber(subscriber);
    });

    session.on("signal:momo-chat", (event) => {
      const data = JSON.parse(event.data);
      setMessage(data);
    });

    session.on("signal:survey-id", (event) => {
      setCurSurvey(Number(event.data));
    });

    getToken(sessionId).then((token) => {
      session
        .connect(token)
        .then(() => {
          if (!isCreated) {
            // console.log("publishing...");
            const host = OV.initPublisher("creatorVideo", {
              resolution: "1280x720",
              publishVideo: camOn,
              publishAudio: micOn,
            });
            setPublisher(host);
            session.publish(host);
          }
          setSession(session);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  const leaveSession = () => {
    // console.log("leaving live session", session, publisher);
    session.disconnect();
  };

  // toggle ??????
  useEffect(() => {
    toggleCam();
  }, [camOn]);
  useEffect(() => {
    toggleMic();
  }, [micOn]);
  useEffect(() => {
    toggleAudio();
  }, [audioOn]);

  // chat ????????? ??????
  useEffect(() => {
    if (message.message) {
      setMessages([...messages, message]);
    }
  }, [message]);

  useEffect(() => {
    return () => {
      if (liveId !== "default") {
        putEndLiveToServer(liveId);
      }
    };
  }, [liveId]);

  const onTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const onContentChange = (event) => {
    setContent(event.target.value);
  };

  const putEndLiveToServer = (liveId) => {
    axios({
      url: `/lives/${liveId}/endLive`,
      method: "put",
      baseURL: `${baseUrl}`,
      headers: setAuthorizationToken(),
    })
      .then((response) => {
        console.log("end request successfully done.");
        // console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    let category;
    await axios({
      url: `/projects/${projectId}`,
      method: "get",
      baseURL: baseUrl,
    })
      .then((response) => {
        category = response.data.projectCategoryId;
      })
      .catch((err) => {
        console.log(err);
      });

    const data = {
      title: title,
      content: content,
      projectId: projectId,
      projectCategoryId: category,
      sessionId: sessionIdToServer,
    };

    await axios({
      url: `/lives`,
      method: "post",
      baseURL: `${baseUrl}`,
      headers: setAuthorizationToken(),
      data: data,
    })
      .then((response) => {
        setLiveID(response.data.liveId);
        setIsSubmitted(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getConnections = async () => {
    await axios({
      url: `/openvidu/api/sessions/` + sessionId + `/connection`,
      method: "get",
      baseURL: OPENVIDU_SERVER_URL,
      headers: {
        Authorization: "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setViewerCnt(response.data.numberOfElements);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const putViewerCntToServer = async (liveId) => {
    await axios({
      url: `/lives/${liveId}/viewerCount`,
      method: "put",
      baseURL: `${baseUrl}`,
      headers: setAuthorizationToken(),
      data: { viewerCount: viewerCnt },
    })
      .then(() => {
        console.log("viewerCnt Updated to", liveId);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (liveId !== "default") {
      putViewerCntToServer(liveId);
    }
  }, [viewerCnt]);

  const cleanUp = () => {
    setCamActive(true);
    setMicActive(true);
    setAudioActive(true);
    setTitle("");
    setContent("");
    setPublisher(pubType);

    setLiveID(-1);
    setProjectId(-1);
    setMessages([]);
    leaveSession();
  };

  const isPublisher = () => {
    return userSideSessionId === "new";
  };

  // ???????????? before mount, unmount
  useEffect(() => {
    sessionId = userSideSessionId;
    if (isPublisher()) {
      sessionId = staffSideSessionId;
    } else {
      setIsSubmitted(true);
      setIsStaff(false);
    }
    setProjectId(projectId);
    setSessionId(sessionId);
    setTimeout(() => {
      joinSession();
    }, 1200);
    const cntView = setInterval(() => {
      getConnections();
    }, 10000);

    return () => {
      clearInterval(cntView);
      cleanUp();
    };
  }, []);

  return (
    <RendererWrapper>
      <TestVideoWrapper
        className={!isSubmitted ? "powderRoom" : "main"}
        id="creatorVideo"
      ></TestVideoWrapper>
      {!isSubmitted ? (
        <>
          <Dashboard id="live-init-form" onSubmit={onSubmit}>
            <DashboardHeader>????????? ?????????</DashboardHeader>
            <DashboardContent>
              <DashBoardInputBox>
                <label>????????? ?????? (??????)</label>
                <DashboardInput
                  id="session-title"
                  required
                  value={title}
                  placeholder="????????? ????????? ???????????????"
                  onChange={onTitleChange}
                ></DashboardInput>
              </DashBoardInputBox>
              <DashBoardInputBox height="150px">
                <label>??????</label>
                <DashBoardTextArea
                  id="desc"
                  value={content}
                  onChange={onContentChange}
                  placeholder="??????????????? ???????????? ?????? ??????????????????"
                ></DashBoardTextArea>
              </DashBoardInputBox>
              {/* <h5>????????? ????????? ??????</h5>
              <ImageUploader /> */}
            </DashboardContent>
            <DashBoardFooter>
              {camOn ? (
                <WeakSwitch onClick={onCamClick}>
                  <ButtonIconActive icon={videocamOutline}></ButtonIconActive>
                </WeakSwitch>
              ) : (
                <Switch onClick={onCamClick}>
                  <ButtonIconInactive
                    icon={videocamOffOutline}
                  ></ButtonIconInactive>
                </Switch>
              )}
              {micOn ? (
                <WeakSwitch onClick={onMicClick}>
                  <ButtonIconActive icon={micOutline}></ButtonIconActive>
                </WeakSwitch>
              ) : (
                <Switch onClick={onMicClick}>
                  <ButtonIconInactive icon={micOffOutline}></ButtonIconInactive>
                </Switch>
              )}
              <Link to={`/myproject/${pjtId}`}>
                <SubmitBtn onClick={leaveSession}>?????????</SubmitBtn>
              </Link>
              <SubmitBtn onClick={onSubmit} type="submit">
                ????????? ??????
              </SubmitBtn>
            </DashBoardFooter>
          </Dashboard>
        </>
      ) : (
        <LiveMain projectId={projectId} />
      )}
    </RendererWrapper>
  );
};
