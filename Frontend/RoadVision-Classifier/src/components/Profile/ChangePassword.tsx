import userProfileService from "../../services/userprofile.service";
import { ChangePasswordDataType } from "../../defination/types/profile.type";
import { useState } from "react";
import { message } from "antd";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = async () => {
    if (newPassword.length < 6 || confirmPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    try {
      const updatedPasswordData: ChangePasswordDataType = {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      };
      console.log("update:", updatedPasswordData);

      await userProfileService.changePassword(
        updatedPasswordData
      );
      message.success("Password updated successfully!");
      setCurrentPassword("e");
      setNewPassword("e");
      setConfirmPassword("e");
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  return (
    <div className="w-full flex flex-col gap-5 p-3 items-center justify-center px-5">
      <div className="Username w-full">
        <label className="text-[#2F3D4C] font-semibold text-base">
          Current password
        </label>
        <input
          type="password"
          className="w-full h-11 p-4 mt-2 rounded-md border-[1px] border-[#2F3D4C] text-sm sm:text-base"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>
      <div className="Username w-full">
        <label className="text-[#2F3D4C] font-semibold text-base">
          New password
        </label>
        <input
          type="password"
          className="w-full h-11 p-4 mt-2 rounded-md border-[1px] border-[#2F3D4C] text-sm sm:text-base"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <div className="Re-enter w-full">
        <label className="text-[#2F3D4C] font-semibold text-base">
          Re-enter new password
        </label>
        <input
          type="password"
          className="w-full h-11 p-4 mt-2 rounded-md border-[1px] border-[#2F3D4C] text-sm sm:text-base"
          defaultValue={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <button
          onClick={handleSave}
          className="w-fit bg-[#3749A6] text-white font-semibold mt-2 p-2 px-5 rounded-full hover:ring-4 hover:ring-blue-300"
        >
          Save Password
        </button>
      </div>
    </div>
  );
}
