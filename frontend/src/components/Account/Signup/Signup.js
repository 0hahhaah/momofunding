import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";
import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../App";
import swal from "sweetalert";

const SignupBackGround = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 100px;
`;

const SignupMainForm = styled.div`
  width: 600px;
  min-height: 800px;
  background-color: whitesmoke;
  border-radius: 10px;
`;

const SignupForm = styled.form`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SignupTitle = styled.label`
  display: block;
  align-self: flex-start;
  font-size: 30px;
  margin: 20px 0px;
  margin-left: 20px;
`;

const SignupInputDiv = styled.div`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 15px;
  input:focus {
    outline: 1px solid #6667ab;
  }
`;

const SignupInputsLabel = styled.label`
  font-size: 15px;
  margin-bottom: 5px;
`;

const SignupInputs = styled.div`
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  border-radius: 5px;
  border-color: transparent;
  padding-left: 10px;
  background-color: #e3e3ef;
`;

const CheckBtns = styled.button`
  font-size: 15px;
  line-height: 30px;
  text-align: center;
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border-color: transparent;
  background-color: #b0e0e6;
  color: black;
  &:hover {
    background-color: #8bdae3;
  }
`;

const CheckBoxForm = styled.div`
  display: flex;
  margin-bottom: 15px;
`;

const CheckBox = styled.div`
  display: inline-block;
  margin-right: auto;
`;

const CheckBoxLabel = styled.label`
  margin-left: 10px;
`;

const SignupBtn = styled(SignupInputs)`
  background-color: #6667ab;
  color: white;
  &:hover {
    background-color: #3c3d8b;
  }
`;

const ErrorMsg = styled.span`
  font-size: 12px;
  color: red;
`;

const SuccessMsg = styled(ErrorMsg)`
  color: green;
`;

const styles = {
  col: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  row: {
    marginLeft: 0,
    marginRight: 0,
  },
};

function Signup() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
  } = useForm();
  const [check, setCheck] = useState(false);
  const onChecked = () => setCheck((prev) => !prev);

  const onValid = (data) => {
    console.log("????????? ??????");
    console.log(emailResult);
    if (!emailResult) {
      setError("email", { message: "????????? ??????????????? ????????????." });
      return;
    }

    if (!nicknameResult) {
      setError("nickname", {
        message: "????????? ??????????????? ????????????.",
      });
      return;
    }
    if (!data.check) {
      setError(
        "check",
        { message: "??????????????? ??????????????????." },
        { shouldFocus: true }
      );
    }
    if (data.password !== data.passwordCheck) {
      setError(
        "passwordCheck",
        { message: "??????????????? ???????????? ????????????." },
        { shouldFocus: true }
      );
    } else {
      signup(data);
      console.log(data);
      navigate("/");
      setValue("email", "");
      setValue("nickname", "");
      setValue("password", "");
      setValue("passwordCheck", "");
    }
  };
  function signup(data) {
    const signup = async () => {
      await axios({
        url: "/users/sign-up",
        method: "post",
        data: {
          email: data.email,
          nickname: data.nickname,
          password: data.password,
        },
        baseURL: baseUrl,
      })
        .then((response) => {
          swal(
            `${data.nickname}??? ???????????????!`,
            `????????? ???????????? ????????? ????????????`,
            "success",
            {
              button: true,
            }
          );
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    signup();
  }
  /////////////////////////////////////////////////////////////////////
  const [checkEmailValue, setCheckEmailValue] = useState("");
  const [checkNicknameValue, setCheckNicknameValue] = useState("");

  // ???????????? ????????? ??????
  const [emailResult, setEmailResult] = useState(false);
  const [nicknameResult, setNicknameResult] = useState(false);

  const [emailShow, setEmailShow] = useState(false);
  const [nicknameShow, setNicknameShow] = useState(false);
  /////////////////////////////////////////////////////////////////////

  const onEmailValueChange = (event) => {
    setCheckEmailValue(event.target.value);
  };
  const onNicknameValueChange = (event) => {
    setCheckNicknameValue(event.target.value);
  };
  /////////////////////////////////////////////////////////////////////

  const isEmail = (email) => {
    var regExp =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    // ????????? ?????? ?????? true ??????
    // console.log('????????? ????????? ?????? :: ', regExp.test(email))
    return regExp.test(email);
  };

  const duplicateEmailCheck = () => {
    console.log(isEmail(checkEmailValue));
    if (isEmail(checkEmailValue)) checkEmail();
    else swal("????????? ????????? ???????????????");
  };

  function checkEmail() {
    const checkEmail = async () => {
      await axios({
        url: `/users/email/duplicate?email=${checkEmailValue}`,
        method: "get",
        baseURL: baseUrl,
      })
        .then((response) => {
          setEmailShow(true);
          console.log(response.data);
          if (response.data.isExist) {
            setEmailResult(false);
          } else {
            setEmailResult(true);
          }
        })
        .catch((error) => {
          console.log("????????????");
          console.log(error);
        });
    };
    checkEmail();
  }

  function checkNickname() {
    const checkNickname = async () => {
      await axios({
        url: `/users/nickname/duplicate?nickname=${checkNicknameValue}`,
        method: "get",
        baseURL: baseUrl,
      })
        .then((response) => {
          setNicknameShow(true);
          console.log(response.data);
          if (response.data.isExist) {
            return;
          } else {
            setNicknameResult(true);
          }
        })
        .catch((error) => {
          console.log("????????????");
          console.log(error);
        });
    };
    checkNickname();
  }

  return (
    <SignupBackGround>
      <SignupMainForm>
        <SignupForm onSubmit={handleSubmit(onValid)}>
          <SignupTitle>????????????</SignupTitle>

          <Container>
            <SignupInputDiv>
              <SignupInputsLabel>?????????[?????????]</SignupInputsLabel>
              <Row style={styles.row}>
                <Col style={styles.col} xs={10}>
                  <SignupInputs
                    as="input"
                    placeholder="example@email.com"
                    {...register("email", {
                      required: "???????????? ???????????????.",
                    })}
                    value={checkEmailValue}
                    onChange={onEmailValueChange}
                  />
                  <ErrorMsg>{errors?.email?.message}</ErrorMsg>
                </Col>
                <Col style={styles.col} xs={2}>
                  <CheckBtns type={"button"} onClick={duplicateEmailCheck}>
                    ????????????
                  </CheckBtns>
                </Col>
                {emailShow ? (
                  emailResult ? (
                    <SuccessMsg>?????? ????????? ??????????????????.</SuccessMsg>
                  ) : (
                    <ErrorMsg>?????? ????????? ??????????????????.</ErrorMsg>
                  )
                ) : null}
              </Row>
            </SignupInputDiv>
            <SignupInputDiv>
              <SignupInputsLabel>?????????</SignupInputsLabel>
              <Row style={styles.row}>
                <Col style={styles.col} xs={10}>
                  <SignupInputs
                    as="input"
                    {...register("nickname", {
                      required: "???????????? ???????????????.",
                    })}
                    value={checkNicknameValue}
                    onChange={onNicknameValueChange}
                  />
                  <ErrorMsg>{errors?.nickname?.message}</ErrorMsg>
                </Col>
                <Col style={styles.col} xs={2}>
                  <CheckBtns type={"button"} onClick={checkNickname}>
                    ????????????
                  </CheckBtns>
                </Col>
                {nicknameShow ? (
                  nicknameResult ? (
                    <SuccessMsg>?????? ????????? ??????????????????.</SuccessMsg>
                  ) : (
                    <ErrorMsg>?????? ????????? ??????????????????.</ErrorMsg>
                  )
                ) : null}
              </Row>
            </SignupInputDiv>

            <SignupInputDiv>
              <SignupInputsLabel>????????????</SignupInputsLabel>
              <Row style={styles.row}>
                <Col style={styles.col} xs={12}>
                  <SignupInputs
                    as="input"
                    type="password"
                    placeholder="????????????"
                    {...register("password", {
                      required: "??????????????? ???????????????.",
                    })}
                  />
                  <ErrorMsg>{errors?.password?.message}</ErrorMsg>
                </Col>
                <Col style={styles.col} xs={12}>
                  <SignupInputs
                    as="input"
                    type="password"
                    placeholder="???????????? ??????"
                    {...register("passwordCheck", {
                      required: "????????????????????? ???????????????.",
                    })}
                  />
                  <ErrorMsg>{errors?.passwordCheck?.message}</ErrorMsg>
                </Col>
              </Row>
            </SignupInputDiv>

            <CheckBoxForm>
              <CheckBox>
                <input
                  id="check"
                  type="checkbox"
                  {...register("check", {
                    required: "??????????????? ??????????????????.",
                  })}
                  onClick={onChecked}
                  value={check}
                />

                <CheckBoxLabel htmlFor="check">
                  ??? ????????? ???????????????.
                </CheckBoxLabel>
                <br />
                <ErrorMsg>{errors?.check?.message}</ErrorMsg>
              </CheckBox>
            </CheckBoxForm>

            <SignupBtn as="button">????????????</SignupBtn>
          </Container>
        </SignupForm>
      </SignupMainForm>
    </SignupBackGround>
  );
}

export default Signup;
