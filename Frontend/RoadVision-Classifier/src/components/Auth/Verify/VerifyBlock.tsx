import { useEffect, useState } from "react";
import { z } from "zod";
import useNavigateTo from "../../../hooks/useNavigateTo";
import NotFound from "../../../pages/NotFound/NotFound";
import { checkObjectAtLeastOneField } from "../../../utils/check.util";
import { VerifyFormDataType } from "../../../defination/types/auth.type";
import authService from "../../../services/auth.service";

// Input validation schema using zod
const verifySchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string(),
  OTP: z.string(),
});

// Type for the verify data inferred from the schema
// type FormData = z.infer<typeof verifySchema>;
type VerifyData = z.infer<typeof verifySchema>;

interface Props {
  verifyEmailRecoidValue: VerifyFormDataType;
}
const VerifyBlock = ({ verifyEmailRecoidValue }: Props) => {
  const { navigateToLogin } = useNavigateTo();

  if (!checkObjectAtLeastOneField(verifyEmailRecoidValue)) {
    return <NotFound />;
  }

  const [otp, setOtp] = useState<string[]>(Array(5).fill(""));
  const [error, setError] = useState<string | null>(null);

    // State for form input data
    const [formData, setFormData] = useState<VerifyData>({
      username: "",
      password: "",
      email: "",
      OTP: "",
    });

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    // Update otp in formData
    setFormData((prevData) => ({
      ...prevData,
      OTP: newOtp.join(""),
    }));

    // Auto next cell
    if (value && index < 4) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleVerifyClick = async () => {
    if (formData.OTP.length !== 5) {
      setError("Please enter all 5 digits of the OTP.");
      return;
    }

    try {

      await authService.verify(formData);
      
      navigateToLogin();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (checkObjectAtLeastOneField(verifyEmailRecoidValue)) {
      setFormData({
        ...formData,
        email: verifyEmailRecoidValue?.email ?? "",
        password: verifyEmailRecoidValue?.password ?? "",
        username: verifyEmailRecoidValue?.username ?? "",
      });
    }
  }, [verifyEmailRecoidValue]);

  return (
    <div className="flex flex-col p-5 sm:p-10 justify-center items-center rounded-2xl bg-white mx-auto mt-2">
      <div className="Header w-full mb-3 md:mb-5 text-2xl md:text-3xl lg:text-4xl text-[#23038C] font-bold text-center">
        VERIFY YOUR ACCOUNT
      </div>
      <span className="font-normal text-[#153C71] text-center text-sm sm:text-base md:text-lg mt-2 md:mt-3">
        A code will be sent to your email
      </span>
      <span className="font-normal mb-3 md:mb-5 text-[#153C71] text-center text-sm sm:text-base md:text-lg">
        Please enter the code below to confirm your email address
      </span>
      <div className="flex space-x-2 mt-2 sm:mt-3">
        {otp.map((value, index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value, index)}
            className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-[#024296]"
            maxLength={1}
            required
          />
        ))}
      </div>
      {error && <span className="text-red-500 mt-2 text-sm">{error}</span>}
      <button
        type="button"
        className="w-full sm:w-[100%] mt-6 sm:mt-10 h-10 sm:h-12 bg-[#024296] rounded-lg text-white font-semibold text-base sm:text-lg flex justify-center items-center"
        onClick={handleVerifyClick}
      >
        CONFIRM
      </button>
    </div>
  );
};

export default VerifyBlock;
