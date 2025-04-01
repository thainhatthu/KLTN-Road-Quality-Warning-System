import React, { useState } from "react";
import { z } from "zod";
import authService from "../../services/auth.service";
import { ForgotFormDataType } from "../../defination/types/auth.type";
import SendSuccess from "./SendSucess";

interface ForgotFormProps {
  onContinue?: Function;
}
const ForgotPassSchema = z.object({
  email: z.string(),
  password: z.string(),
});
type FormData = z.infer<typeof ForgotPassSchema>;

const ForgotForm: React.FC<ForgotFormProps> = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isSucess, setIsSucess] = React.useState<boolean>(false);

  const handleResend = () => {
    alert("Resend");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContinue = async () => {
    setError(null);
    setIsSucess(false);

    try {
      await authService.forgotPass(formData as ForgotFormDataType);
      setIsSucess(true);
    } catch (err) {
      setError("Email does not exist. Please check your email again!");
    }
  };

  if (isSucess) {
    return <SendSuccess handleResend={handleResend} />;
  }

  return (
    <div className="w-full h-screen bg-[#CFEEFF] flex justify-center items-center">
      <div className="flex flex-col p-10 justify-center items-center w-[60%] lg:h-[80%] h-fit rounded-2xl bg-white shadow-2xl">
        <div className="Header w-full mb-5 md:text-4xl text-3xl text-[#23038C] font-bold text-center">
          FORGOT PASSWORD
        </div>
        <span className="font-normal text-[#153C71] text-center text-lg md:text-left mt-3">
          A new password will be sent to your email.
        </span>
        <span className="font-normal text-[#153C71] text-center text-lg md:text-left mt-3">
          Please enter the email you used to register.
        </span>

        <div className="Username w-[80%] mt-4 mb-5">
          <label className="text-[#2F3D4C] font-semibold text-base">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full h-11 p-4 mt-2 rounded-md border-[1px] border-[#2F3D4C] text-sm sm:text-base"
            required
          />
        </div>
        {error && <span className="text-red-500">{error}</span>}
        <button
          type="submit"
          onClick={handleContinue}
          className="w-[50%] mt-10 h-12 bg-[#024296]  hover:bg-[#284773] rounded-lg text-white font-semibold text-base sm:text-lg flex justify-center items-center"
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
};

export default ForgotForm;
