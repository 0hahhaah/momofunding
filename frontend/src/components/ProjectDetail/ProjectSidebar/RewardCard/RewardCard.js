import styled from "styled-components";
import { MomoColor, MomoStrongColor } from "../../../../shared/global";
import { InfoCard, Text } from "../CreatorCard/styles";
import { useState } from "react";
import { IonIcon } from "@ionic/react";
import { caretUp, caretDown } from "ionicons/icons";
import { comma } from "../../../../atoms";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

const Card = styled(InfoCard)`
  height: auto;
  padding: 20px 0;
  align-items: flex-start;
  justify-content: space-evenly;
  :hover {
    /* margin: 23px; */
    transform: scale(1.05);
    transition: 0.3s ease-in-out;
    cursor: pointer;
  }
`;

const RewardTitle = styled.p`
  font-size: 24px;
  font-weight: bold;
  padding-right: 20px;
  /* margin: auto 0; */
  color: ${MomoColor};
`;

const Price = styled.p`
  font-size: 36px;
  margin: 3px;
  color: #424242;
`;

const RewardDetail = styled.p`
  margin: 3px;
  color: #7b7b7b;
`;

const Space = styled.div`
  height: 30px;
`;

// RewardSelected
const Space1 = styled.div`
  height: 15px;
`;

const Amounts = styled.div`
  display: flex;
  align-items: center;
  flex-direction: space-around;
  padding: 10px;
  margin: auto;
`;

const Amount = styled.div`
  width: 164px;
  height: 61px;
  border-radius: 10px;
  border: 1px solid ${MomoColor};
  position: relative;
  p {
    width: 70%;
    text-align: right;
    line-height: 61px;
    font-size: 24px;
    color: #7b7b7b;
  }
`;

const FundBtn = styled.button`
  width: 126px;
  height: 62px;
  border-radius: 15px;
  font-size: 18px;
  :hover {
    background-color: ${MomoStrongColor};
  }
`;

const CountUp = styled(IonIcon)`
  width: 30px;
  height: 30px;
  color: ${MomoColor};
  position: absolute;
  top: 4px;
  right: 13px;
`;

const CountDown = styled(CountUp)`
  top: 24px;
`;

const Space2 = styled.div`
  width: 10px;
`;

function RewardCard(props) {
  const [amount, setAmount] = useState(0);
  const [clicked, setClicked] = useState(false);
  const deliveryDate = new Date(props.rewards.deliverStartDate);

  function countUp() {
    setAmount(amount + 1);
  }
  function countDown() {
    if (amount > 0) {
      setAmount(amount - 1);
    }
  }

  const navigate = useNavigate();

  const goToPay = () => {
    const data = {
      project: props.project,
      reward: props.rewards,
      amount: amount,
    };
    if (
      amount > props.rewards.limitedQuantity ||
      props.rewards.limitedQuantity <= 0
    ) {
      swal("?????? ????????? ??????????????????", { icon: "warning" });
      return;
    }

    navigate(`/funding`, { state: { data: data } });
    window.scrollTo(0, 0);
  };

  return (
    <Card>
      <div
        onClick={() => {
          setClicked(!clicked);
        }}
      >
        <Text>
          <RewardTitle>{props.rewards.name}</RewardTitle>
          <Price>{comma(props.rewards.price)}???</Price>

          <p>{props.rewards.content}</p>
        </Text>
        <Space />
        <Text>
          <RewardDetail>{props.rewards.limitedQuantity}??? ??????</RewardDetail>
          <RewardDetail>
            ?????? ????????? {deliveryDate.toLocaleDateString()}
          </RewardDetail>
        </Text>
      </div>

      {clicked ? (
        <Amounts>
          <Space1 />
          <Amount>
            <p>{amount}</p>
            <CountUp icon={caretUp} onClick={countUp} />
            <CountDown icon={caretDown} onClick={countDown} />
          </Amount>
          <Space2 />
          <FundBtn
            onClick={() => {
              goToPay();
            }}
          >
            ????????????
          </FundBtn>
        </Amounts>
      ) : null}
    </Card>
  );
}

export default RewardCard;
