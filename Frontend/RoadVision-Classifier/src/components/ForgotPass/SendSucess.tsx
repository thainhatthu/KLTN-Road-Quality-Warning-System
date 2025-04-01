import forgot from "../../assets/img/forgot.png";
import useNavigateTo from "../../hooks/useNavigateTo";

interface Props {
  handleResend: Function;
}
export default function SendSuccess({ handleResend }: Props) {
  const { navigateToLogin } = useNavigateTo();

  return (
    <div className="w-full h-screen bg-[#CFEEFF] flex justify-center items-center">
      <div className="flex flex-col p-10 justify-center items-center w-[60%] lg:h-[80%] h-fit rounded-2xl bg-white shadow-2xl">
        <div className="Header w-full mb-3 md:text-4xl text-3xl text-[#23038C] font-bold text-center">
          SEND SUCCESSFUL
        </div>
        <span className="font-normal text-[#153C71] text-center text-lg md:text-left mt-3 mb-3">
          Check your email now to get the new password.
        </span>
        <img className="w-60 h-60 sm:w-[38%] sm:h-[50%]" src={forgot} />
        <div className="flex items-center justify-center mt-1">
          <label className="inline-flex items-center">
            Don't receive email?{" "}
          </label>
          <button
            className="cursor-pointer text-sm font-bold ml-1"
            onClick={() => handleResend()}
          >
            Resend
          </button>
        </div>
        <button
          onClick={navigateToLogin}
          type="button"
          className="w-[50%] mt-10 h-12 bg-[#024296] rounded-lg text-white font-semibold text-base sm:text-lg flex justify-center items-center"
        >
          LOGIN AGAIN
        </button>
      </div>
    </div>
  );
}
