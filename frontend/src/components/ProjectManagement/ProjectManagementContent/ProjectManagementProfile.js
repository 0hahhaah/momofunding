import styled from "styled-components";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import setAuthorizationToken, { createProjectIdState } from "../../../atoms";
import { useRecoilValue } from "recoil";
import { baseUrl } from "../../../App";
const ProjectManagementMain = styled.div`
  width: 100%;
  min-height: 800px;
`;

const ProjectManagementContentForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  padding: 50px;
`;

const ProjectManagementContentInputBox = styled.div`
  width: 90%;
  margin: auto;
  margin-bottom: 50px;
`;
const ProjectManagementContentTitle = styled.div`
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 5px;
`;
const ProjectManagementContentMemo = styled.div`
  font-size: 15px;
  margin-bottom: 10px;
`;
const ProjectManagementContentInput = styled.input`
  width: 100%;
  height: 50px;
  border-radius: 5px;
  border-color: transparent;
  padding: 5px;
  background-color: #e3e3ef;
  &:focus {
    outline: 1px solid #6667ab;
  }
`;

const ProjectManagementContentProfileTitle = styled.h3`
  text-align: center;
`;

const ProjectManagementContentTextarea = styled(ProjectManagementContentInput)`
  height: 150px;
`;

const ProjectManagementContentImgBox = styled.div`
  height: 200px;
`;

const ProjectManagementContentImg = styled.img`
  display: block;
  width: 200px;
  height: 200px;
  border-radius: 5px;
  margin-right: auto;
  margin-bottom: 20px;
`;

const ProjectManagementContentImgLabel = styled.label`
  display: block;
  width: 70px;
  text-align: center;
  background-color: #6667ab;
  color: white;
  border-radius: 5px;
  padding: 3px;
  cursor: pointer;
  float: right;
`;
const ProjectManagementContentImgInput = styled.input`
  /* display: none; */
`;

const ProjectManagementContentProfileBtn = styled.button`
  margin-left: 48px;
`;

const ErrorMsg = styled.span`
  font-size: 12px;
  color: red;
`;

function ProjectManagementProfile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm();
  const location = useLocation();
  // const { userId } = location.state;
  // const { projectId } = location.state;
  const projectId = useRecoilValue(createProjectIdState);
  const [creatorName, setCreatorName] = useState("");
  const [creatorImageUrl, setCreatorImageUrl] = useState("");
  const [creatorContent, setCreatorContent] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [account, setAccount] = useState("");

  const defaultMsg = baseUrl + "/creator/default.png";
  //////////////////////////////////////////////////////////////////////
  // onChangeEvent...
  const onCreatorNameChange = (event) => {
    setCreatorName(event.target.value);
  };
  const onCreatorImageUrlChange = (event) => {
    const tempImg = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      setCreatorImageUrl(e.target.result);
    };
    reader.readAsDataURL(tempImg);
  };
  const onCreatorContentChange = (event) => {
    setCreatorContent(event.target.value);
  };
  const onEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const onTelChange = (event) => {
    setTel(event.target.value);
  };
  const onAccountChange = (event) => {
    setAccount(event.target.value);
  };
  //////////////////////////////////////////////////////////////////////
  // get?????? ???????????? ??????????????? ????????????
  function getCreator() {
    const getCreator = async () => {
      await axios({
        url: `/creators/${projectId}`,
        method: "get",
        baseURL: baseUrl,
      })
        .then((response) => {
          if (response.data.creatorName) {
            setCreatorName(response.data.creatorName);
            setValue("creatorName", response.data.creatorName);
          } else {
            setCreatorName("");
          }
          if (response.data.creatorImageUrl) {
            setCreatorImageUrl(response.data.creatorImageUrl);
          } else {
            setCreatorImageUrl(defaultMsg);
          }
          if (response.data.creatorContent) {
            setCreatorContent(response.data.creatorContent);
            setValue("creatorContent", response.data.creatorContent);
          } else {
            setCreatorContent("");
          }
          if (response.data.email) {
            setEmail(response.data.email);
            setValue("email", response.data.email);
          } else {
            setEmail("");
          }
          if (response.data.tel) {
            setTel(response.data.tel);
            setValue("tel", response.data.tel);
          } else {
            setTel("");
          }
          if (response.data.account) {
            setAccount(response.data.account);
            setValue("account", response.data.account);
          } else {
            setAccount("");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getCreator();
  }

  //////////////////////////////////////////////////////////////////////
  // put?????? ???????????? ????????? ?????? ????????? (json + file) ??? ?????? ????????? ??????
  // $ : jquery??? ???????????? ???????????? npm install jquery ????????? => useRef?????? ?????? ??????
  const formRef = useRef(null); // useRef Hook??? ????????? form ?????? ????????????

  const updateCreator = (event) => {
    // event.preventDefault(); // ???????????? ??????
    const data = {
      // json ????????? ?????????
      creatorName: creatorName,
      creatorImageUrl: creatorImageUrl.slice(0, 500),
      creatorContent: creatorContent,
      email: email,
      tel: tel,
      account: account,
    };

    // const form = $("#form")[0]; =>  input file??? ????????? ?????? form
    const form = formRef[0]; // useRef??? ????????? jquery?????? form????????? ???????????? ??????
    const formData = new FormData(form); // new formData() ????????? : file??? ???????????? ??????!

    formData.append(
      "creator",
      new Blob([JSON.stringify(data)], { type: "application/json" })
      // ????????? json?????? ?????? data??? ?????? new Blob(?????????????????? ????????? ??????)??? ?????? type??? ??????
    );
    formData.append("creatorImage", $("#file")[0].files[0]);

    const updateCreator = async () => {
      await axios({
        url: `/creators/${projectId}`,
        method: "put",
        data: formData, // ????????? ?????? formData??? data????????? ?????? ???!!
        headers: setAuthorizationToken(),
        baseURL: baseUrl,
        processData: false,
        contentType: false,
      })
        .then((response) => {
          window.location.reload(true);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    updateCreator();
  };

  const onValid = (data) => {
    updateCreator();
  };

  useEffect(() => {
    getCreator();
    // window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <ProjectManagementMain>
        <ProjectManagementContentProfileTitle>
          ????????? ????????? ??????
        </ProjectManagementContentProfileTitle>
        <ProjectManagementContentForm
          ref={formRef}
          enctype="multipart/form-data"
          onSubmit={handleSubmit(onValid)}
        >
          <ProjectManagementContentInputBox>
            <ProjectManagementContentTitle>
              ????????? ??????
            </ProjectManagementContentTitle>
            <ProjectManagementContentMemo>
              ??????????????? ????????? ???????????????.
            </ProjectManagementContentMemo>
            <ProjectManagementContentInput
              as={"input"}
              {...register("creatorName", {
                required: "????????? ????????? ???????????????.",
              })}
              value={creatorName}
              onChange={onCreatorNameChange}
            ></ProjectManagementContentInput>
            <ErrorMsg>{errors?.creatorName?.message}</ErrorMsg>
          </ProjectManagementContentInputBox>

          <ProjectManagementContentInputBox>
            <ProjectManagementContentTitle>
              ????????? ???????????????
            </ProjectManagementContentTitle>
            <ProjectManagementContentMemo>
              ????????? ?????? ?????????????????? ??????????????????. (?????? 1000px????????? JPG,
              PNG, BMP ????????? ????????? ??????)
            </ProjectManagementContentMemo>
            <ProjectManagementContentImgInput
              type="file"
              id="file"
              name="file"
              onChange={onCreatorImageUrlChange}
            />

            <ProjectManagementContentImgBox>
              <ProjectManagementContentImg
                src={
                  creatorImageUrl === defaultMsg
                    ? "/photo/profile.png"
                    : creatorImageUrl
                }
                alt="No Image Available"
              ></ProjectManagementContentImg>
            </ProjectManagementContentImgBox>
          </ProjectManagementContentInputBox>

          <ProjectManagementContentInputBox>
            <ProjectManagementContentTitle>
              ????????????
            </ProjectManagementContentTitle>
            <ProjectManagementContentMemo>
              ??????????????? ??????????????????.
            </ProjectManagementContentMemo>
            <ProjectManagementContentTextarea
              as={"textarea"}
              {...register("creatorContent", {
                required: "????????? ????????? ???????????????.",
              })}
              value={creatorContent}
              onChange={onCreatorContentChange}
            ></ProjectManagementContentTextarea>
            <ErrorMsg>{errors?.creatorContent?.message}</ErrorMsg>
          </ProjectManagementContentInputBox>

          <ProjectManagementContentInputBox>
            <ProjectManagementContentTitle>
              ?????????
            </ProjectManagementContentTitle>
            <ProjectManagementContentMemo>
              ??????????????? ???????????? ???????????????.
            </ProjectManagementContentMemo>
            <ProjectManagementContentInput
              placeholder="example@email.com"
              as={"input"}
              {...register("email", {
                required: "???????????? ???????????????.",
              })}
              value={email}
              onChange={onEmailChange}
            ></ProjectManagementContentInput>
            <ErrorMsg>{errors?.email?.message}</ErrorMsg>
          </ProjectManagementContentInputBox>

          <ProjectManagementContentInputBox>
            <ProjectManagementContentTitle>
              ????????????
            </ProjectManagementContentTitle>
            <ProjectManagementContentMemo>
              ??????????????? ??????????????? ???????????????.
            </ProjectManagementContentMemo>
            <ProjectManagementContentInput
              placeholder="- ?????? ??????"
              as={"input"}
              {...register("tel", {
                required: "??????????????? ???????????????.",
              })}
              value={tel}
              onChange={onTelChange}
            ></ProjectManagementContentInput>
            <ErrorMsg>{errors?.tel?.message}</ErrorMsg>
          </ProjectManagementContentInputBox>

          <ProjectManagementContentInputBox>
            <ProjectManagementContentTitle>
              ????????????
            </ProjectManagementContentTitle>
            <ProjectManagementContentMemo>
              ??????????????? ??????????????? ???????????????.
            </ProjectManagementContentMemo>
            <ProjectManagementContentInput
              as={"input"}
              {...register("account", {
                required: "??????????????? ???????????????.",
              })}
              value={account}
              onChange={onAccountChange}
            ></ProjectManagementContentInput>
            <ErrorMsg>{errors?.account?.message}</ErrorMsg>
          </ProjectManagementContentInputBox>
          <ProjectManagementContentProfileBtn>
            ????????? ??????
          </ProjectManagementContentProfileBtn>
        </ProjectManagementContentForm>
      </ProjectManagementMain>
    </div>
  );
}
export default ProjectManagementProfile;
