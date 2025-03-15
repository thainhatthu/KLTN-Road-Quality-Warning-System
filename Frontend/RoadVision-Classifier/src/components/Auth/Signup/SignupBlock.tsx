import gg from "../../../assets/img/gg.png";
import fb from "../../../assets/img/fb.png";
import React, { useState } from "react";
import { z } from "zod";
import { useRecoilState } from "recoil";
import { verifyEmailState } from "../../../atoms/authState";
import authService from "../../../services/auth.service";
import {
  ERROR_MESSAGES,
  LAUNCHPAD_MESSAGES,
} from "../../../defination/consts/messages.const";
import useNavigateTo from "../../../hooks/useNavigateTo";

// Input validation schema using zod
const signupSchema = z
  .object({
    username: z.string().min(6, ERROR_MESSAGES.auth.username),
    password: z.string().min(6, ERROR_MESSAGES.auth.password),
    reEnterPassword: z.string().min(6, ERROR_MESSAGES.auth.password),
    email: z.string().email(ERROR_MESSAGES.common.email),
  })
  .refine((data) => data.password === data.reEnterPassword, {
    message: ERROR_MESSAGES.auth.passwordMatch,
    path: ["reEnterPassword"], // Hiển thị lỗi trên trường này
  });

// Extend the schema with additional field for re-entering password
type FormData = z.infer<typeof signupSchema> & { reEnterPassword: string };

// Main SignupBlock component
const SignupBlock = () => {
  const { navigateToLogin, navigateVerify } = useNavigateTo();
  // Recoil state for email verification
  const [, setVerifyEmailRecoidState] = useRecoilState(verifyEmailState);

  // State for form input data
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    email: "",
    reEnterPassword: "",
  });

  // State for error messages
  const [error, setError] = useState<string | null>(null);

  // Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Extract field name and value
    setFormData((prev) => ({
      ...prev, // Preserve previous state
      [name]: value, // Update the field dynamically
    }));
  };

  // Handle sign-up button click
  const handleSignupClick = async () => {
    setError(null); // Reset error state

    // Validate input data using zod schema
    const parseResult = signupSchema.safeParse(formData);
    if (!parseResult.success) {
      const errorMessage = parseResult.error.errors[0].message;
      setError(errorMessage);
      return;
    }

    try {
      // Call the API for sign-up
      await authService.signUp(formData);

      // Update Recoil state with verification info
      setVerifyEmailRecoidState({
        email: formData.email,
        password: formData.password,
        username: formData.username,
      });
      navigateVerify();
    } catch (err) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 sm:p-10 flex flex-col gap-2 items-center justify-center">
      {/* Header Section */}
      <div className="Header w-full md:text-4xl text-3xl text-[#23038C] font-bold text-left">
        {LAUNCHPAD_MESSAGES.auth.sign_up}
      </div>

      {/* Sign-Up Form */}
      <form className="w-full" onSubmit={(e) => e.preventDefault()}>
        {/* Username Input */}
        <div className="Username w-full">
          <label className="text-[#2F3D4C] font-semibold text-base">
            {LAUNCHPAD_MESSAGES.common.username}
          </label>
          <input
            type="text"
            name="username"
            placeholder="Enter the username"
            value={formData.username}
            onChange={handleChange}
            className="w-full h-11 p-4 rounded-md border-[1px] border-[#2F3D4C] text-sm sm:text-base"
          />
        </div>

        {/* Email Input */}
        <div className="Email w-full">
          <label className="text-[#2F3D4C] font-semibold text-base">
            {LAUNCHPAD_MESSAGES.common.email}
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter the email"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-11 p-4 rounded-md border-[1px] border-[#2F3D4C] text-sm sm:text-base"
          />
        </div>

        {/* Password Input */}
        <div className="Password w-full">
          <label className="text-[#2F3D4C] font-semibold text-base">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter the password"
            value={formData.password}
            onChange={handleChange}
            className="w-full h-11 p-4 rounded-md border-[1px] border-[#2F3D4C] text-sm sm:text-base"
          />
        </div>

        {/* Re-enter Password Input */}
        <div className="Re-enterpassword w-full">
          <label className="text-[#2F3D4C] font-semibold text-base">
            Re-enter password
          </label>
          <input
            type="password"
            name="reEnterPassword"
            placeholder="Re-enter the password"
            value={formData.reEnterPassword}
            onChange={handleChange}
            className="w-full h-11 p-4 rounded-md border-[1px] border-[#2F3D4C] text-sm sm:text-base"
          />
        </div>
      </form>

      {/* Display Error Message */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {/* Login Redirect Section */}
      <div className="flex items-center justify-center mt-4">
        <label className="inline-flex items-center">
          Already have an account?{" "}
        </label>
        <a
          onClick={navigateToLogin}
          className="cursor-pointer hover:text-blue-800 text-sm font-bold ml-1"
        >
          Login
        </a>
      </div>

      {/* Sign-Up Button */}
      <button
        onClick={handleSignupClick}
        className="w-full h-12 bg-[#024296] rounded-lg text-white font-semibold text-sm sm:text-base flex justify-center items-center hover:bg-[#27558f]"
      >
        Create Account
      </button>

      {/* Divider for Social Sign-Up */}
      <div className="flex items-center justify-center mt-4">
        <span className="text-[#2d2c2c]">________</span>
        <label className="inline-flex items-center text-[#2d2c2c] mx-2 text-sm">
          OR SIGNUP WITH
        </label>
        <span className="text-[#2d2c2c]">________</span>
      </div>

      {/* Social Sign-Up Buttons */}
      <div className="flex flex-row justify-center gap-2 mt-4">
        <button className="w-20 h-10 sm:w-15 sm:h-15 rounded-lg border-[2px] border-[#a5b3ff] flex justify-center items-center">
          <img src={fb} alt="Facebook" className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button className="w-20 h-10 sm:w-15 sm:h-15 rounded-lg border-[2px] border-[#a5b3ff] flex justify-center items-center">
          <img src={gg} alt="Google" className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
};

export default SignupBlock;
