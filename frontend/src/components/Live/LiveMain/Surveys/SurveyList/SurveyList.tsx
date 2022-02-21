import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import Swal from "sweetalert2";
import { baseUrl } from "../../../../../App";
import { pjtIdState, sessionState } from "../../../LiveAtoms";
import {
  SurveyItemWrapper,
  SurveyListWrapper,
  SurveysNotExists,
} from "./styles";

type surveysProp = {
  id: number;
  title: string;
  endDate: string;
};

export const SelectedSurveyState = atom({
  key: "curSurvey",
  default: -1,
});

export const SurveyList = () => {
  const [surveys, setSurveys] = useState([] as surveysProp[]);
  const [session, setSession] = useRecoilState(sessionState);
  const [pjtId, _] = useRecoilState(pjtIdState);

  const getSurveyList = async () => {
    await axios({
      url: `/surveys/projects/${pjtId}`,
      method: "get",
      baseURL: `${baseUrl}`,
    })
      .then((res) => {
        const data: surveysProp[] = res.data;
        setSurveys(data);
      })
      .catch((error) => console.log(error));
  };
  // constructor
  useEffect(() => {
    getSurveyList();
  }, []);

  const isSurveyExists = () => {
    return surveys.length !== 0;
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-right",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  return (
    <SurveyListWrapper>
      {isSurveyExists() ? (
        <>
          {surveys?.map((survey, idx) => (
            <SurveyItemWrapper
              key={idx}
              onClick={() => {
                Toast.fire({
                  icon: "success",
                  title: `${idx + 1}번 설문이 정상적으로 전송되었습니다.`,
                });
                session.signal({
                  data: `${survey.id}`,
                  to: [],
                  type: "survey-id",
                });
              }}
            >
              {survey.title}
            </SurveyItemWrapper>
          ))}
        </>
      ) : (
        <SurveysNotExists>
          사전에 설정한 설문이 존재하지 않아요. 😥
        </SurveysNotExists>
      )}
    </SurveyListWrapper>
  );
};
