import ForgotForm from "../../../components/ForgotPass/ForgotForm";
import { Carousel } from "antd";
import { useRef, useState } from "react";
import SendSuccess from "../../../components/ForgotPass/SendSucess";

export default function AuthForgotPass() {
  const carouselRef = useRef<any>(null);
  const [isSendSuccessVisible, setSendSuccessVisible] = useState(false);

  const handleNextSlide = () => {
    setSendSuccessVisible(true);
    carouselRef.current?.next();
  };

  return (
    <Carousel
      ref={carouselRef}
      arrows={false}
      draggable={false}
      swipeToSlide={false}
    >
      <div>
        <ForgotForm onContinue={handleNextSlide} />
      </div>
      {isSendSuccessVisible && (
        <div>
          <SendSuccess handleResend={() => {}} />
        </div>
      )}
    </Carousel>
  );
}
