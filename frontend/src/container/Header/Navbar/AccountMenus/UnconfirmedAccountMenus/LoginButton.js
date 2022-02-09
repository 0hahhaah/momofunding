import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import setAuthorizationToken from "../../../../../atoms";

const LoginBackGround = styled.div`
  display: flex;
  justify-content: center;
`;

const LoginMainForm = styled.div`
  width: 500px;
  height: 500px;
  background-color: whitesmoke;
  border-radius: 10px;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const GeneralLoginForm = styled.div`
  width: 350px;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  /* align-items: center; */
`;

const InputIdAndPw = styled.input`
  width: 350px;
  height: 40px;
  border-radius: 5px;
  border-color: transparent;
  margin-bottom: 20px;
  padding-left: 10px;
  background-color: #e3e3ef;
  &:focus {
    outline: 1px solid #6667ab;
  }
`;

const LoginTitle = styled.label`
  font-size: 40px;
  margin: 30px 0px;
  align-self: center;
`;

const CheckBoxAndLink = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const CheckBox = styled.div`
  display: inline-block;
  margin-right: auto;
`;

const CheckBoxLabel = styled.label`
  margin-left: 10px;
`;

const FindIdOrPw = styled.div`
  display: inline-block;
  margin-left: auto;
  color: black;
  background-color: transparent;
  /* color: black;
  text-decoration: none; */
`;

const LoginBtn = styled(InputIdAndPw)`
  background-color: #6667ab;
  color: white;
  &:hover {
    background-color: #3c3d8b;
  }
`;

const SeparateLineForm = styled.div`
  display: flex;
  align-items: center;
`;

const SeparateLine = styled.hr`
  display: inline;
  width: 150px;
  margin: 10px;
`;

const SocialLoginForm = styled.div``;

const SocialLoginBtns = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0px;
`;

const SocialLoginLogo = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 15px;
`;

const GoToSiginupForm = styled.div``;

const GoToSignupMessage = styled.label`
  margin-right: 10px;
`;

const GoToSignup = styled.a`
  color: blue;
  text-decoration: none;
`;

const styles = {
  bgColor: {
    backgroundColor: "whitesmoke",
  },
};

const LoginModalBtn = styled.button`
  background-color: #6667ab;
  color: white;
  border: 0;
  outline: 0;
  &:hover {
    color: blue;
  }
`;

function LoginButton() {
  const navigate = useNavigate();
  const goToFind = () => {
    navigate("/findAccount/findId");
    setShow(false);
  };
  const baseUrl = "http://localhost:8080";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  function signin(event) {
    event.preventDefault();

    const signin = async () => {
      await axios({
        url: "/users/sign-in",
        method: "post",
        data: {
          email: email,
          password: password,
        },
        baseURL: baseUrl,
      })
        .then((response) => {
          console.log(response.data);
          setEmail("");
          setPassword("");
          const token = response.data.token;
          localStorage.setItem("auth-token", token);
          setAuthorizationToken(token);
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
        });
    };
    signin();
  }

  const onEmailChange = (event) => {
    event.preventDefault();
    setEmail(event.target.value);
  };

  const onPasswordChange = (event) => {
    event.preventDefault();
    setPassword(event.target.value);
  };

  return (
    <>
      <LoginModalBtn onClick={handleShow}>로그인</LoginModalBtn>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header style={styles.bgColor} closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>

        <Modal.Body
          style={{
            backgroundColor: "whitesmoke",
          }}
          closeButton
        >
          <LoginBackGround>
            <LoginMainForm>
              <LoginForm onSubmit={signin}>
                <GeneralLoginForm>
                  <LoginTitle>WelCome Back!</LoginTitle>
                  <InputIdAndPw
                    placeholder="이메일"
                    value={email}
                    onChange={onEmailChange}
                  />
                  <InputIdAndPw
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={onPasswordChange}
                  />

                  <CheckBoxAndLink>
                    <CheckBox>
                      <input id="check" type="checkbox" />
                      <CheckBoxLabel for="check">아이디 저장</CheckBoxLabel>
                    </CheckBox>
                    <FindIdOrPw as="button" onClick={goToFind}>
                      아이디, 비밀번호 찾기
                    </FindIdOrPw>
                  </CheckBoxAndLink>

                  <LoginBtn as="button">로그인</LoginBtn>
                </GeneralLoginForm>
              </LoginForm>
            </LoginMainForm>
          </LoginBackGround>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default LoginButton;
