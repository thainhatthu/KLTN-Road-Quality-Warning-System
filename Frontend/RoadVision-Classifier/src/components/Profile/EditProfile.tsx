import { useState } from "react";
import { Select, DatePicker, message } from "antd";
import { countryList } from "./country";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useRecoilValue } from "recoil";
import { profileState } from "../../atoms/profileState";
import userProfileService from "../../services/userprofile.service";
import {
  EditProfileDataType,
  UploadAvatarType,
} from "../../defination/types/profile.type";

dayjs.extend(customParseFormat);
const { Option } = Select;
const dateFormatList = ["DD-MM-YYYY"];

export default function EditProfile() {
  const profileData = useRecoilValue(profileState);

  const [selectedGender, setSelectedGender] = useState<string>(
    profileData.gender || ""
  );
  const [fullname, setFullname] = useState(profileData.fullname || "");
  const [phonenumber, setPhonenumber] = useState(profileData.phonenumber || "");
  const [address, setAddress] = useState(profileData.location || "");
  const [selectedCountry, setSelectedCountry] = useState<string>(
    profileData.state || ""
  );
  const [selectedBirthday, setSelectedBirthday] = useState<string>(
    profileData.birthday || ""
  );
  const [, setAvatar] = useState<string>(profileData.avatar || "");

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);
      try {
        const uploadData: UploadAvatarType = { file: file };
        const response = await userProfileService.uploadAvatar(uploadData);
        console.log("Response from API:", response);

        if (
          response &&
          response.status &&
          response.status.toString() === "Success"
        ) {
          const newAvatarUrl = response.data.avatarUrl;
          setAvatar(newAvatarUrl);
          alert("Avatar uploaded successfully!");
        } else {
          alert("Failed to upload avatar.");
        }
      } catch (error) {
        console.error("Error uploading avatar:", error);
        alert("Something went wrong while uploading avatar.");
      }
    }
  };

  const handleButtonClick = () => {
    const avatarInput = document.getElementById("avatar") as HTMLInputElement;
    if (avatarInput) {
      avatarInput.click();
    }
  };

  const handleGenderChange = (value: string) => setSelectedGender(value);
  const handleBirthdayChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedBirthday(date.format("YYYY-DD-MM"));
    } else {
      setSelectedBirthday("");
    }
  };
  const handleCountryChange = (value: string) => setSelectedCountry(value);

  const handleSave = async () => {
    try {
      const phoneNumberAsString = String(phonenumber);

      const updatedProfileData: EditProfileDataType = {
        username: "",
        fullname: fullname,
        birthday: selectedBirthday,
        gender: selectedGender,
        phonenumber: phoneNumberAsString,
        location: address,
        state: selectedCountry,
      };

      await userProfileService.editProfile(updatedProfileData);

      message.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-72 text-center py-5 gap-10">
      {/* Other form fields (Full Name, Phone Number, Date of Birth, etc.) */}
      <div className="flex flex-row px-5 justify-between items-center w-[95%] gap-2">
        {/* Full Name */}
        <div className="w-[30%]">
          <div className="text-left font-normal font-sm text-gray-700 text-sm">
            Full Name
          </div>
          <div className="flex items-center space-x-4 mt-1 px-2 py-2 bg-white border rounded-md">
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="flex-1 bg-white text-base outline-none"
              placeholder={profileData.fullname || "Enter full name"}
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="w-[30%]">
          <div className="text-left font-normal font-sm text-gray-700 text-sm">
            Phone number
          </div>
          <div className="flex items-center space-x-4 mt-1 px-2 py-2 bg-white border rounded-md">
            <input
              type="text"
              value={phonenumber}
              onChange={(e) => setPhonenumber(e.target.value)}
              className="flex-1 bg-white text-base outline-none"
              placeholder={profileData.phonenumber || "Enter phone number"}
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div className="w-[30%]">
          <div className="text-left font-normal font-sm text-gray-700 text-sm">
            Date of birth
          </div>
          <DatePicker
            className="w-full py-2 mt-1 text-xl font-semibold"
            value={
              selectedBirthday ? dayjs(selectedBirthday, "YYYY-MM-DD") : null
            }
            format={dateFormatList[0]}
            placeholder="Select your date of birth"
            onChange={handleBirthdayChange}
          />
        </div>
      </div>

      {/* Gender and other fields */}
      <div className="flex flex-row px-5 justify-between items-center w-[95%] gap-2">
        {/* Gender */}
        <div className="w-[30%]">
          <div className="text-left font-normal font-sm text-gray-700 text-sm">
            Gender
          </div>
          <Select
            value={selectedGender || "Select gender"}
            onChange={handleGenderChange}
            className={`w-full text-left text-base mt-1 h-10 font-base ${
              selectedGender === "Select gender" ? "text-gray-400" : "text-gray"
            }`}
          >
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
            <Option value="Other">Other</Option>
          </Select>
        </div>

        {/* Address */}
        <div className="w-[30%]">
          <div className="text-left font-normal font-sm text-gray-700 text-sm">
            Address
          </div>
          <div className="flex items-center space-x-4 mt-1 px-2 py-2 bg-white border rounded-md">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1 bg-white text-base outline-none"
              placeholder={profileData.location || "Enter your address"}
            />
          </div>
        </div>

        {/* Country */}
        <div className="w-[30%]">
          <div className="text-left font-normal font-sm text-gray-700 text-sm">
            Country
          </div>
          <Select
            value={selectedCountry}
            onChange={handleCountryChange}
            className={`w-full text-left text-base mt-1 h-10 font-base`}
          >
            {countryList.map((country) => (
              <Option key={country.key} value={country.label}>
                {country.label}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Save Button */}
      <div>
        <button
          onClick={handleSave}
          className="w-fit bg-[#3749A6] text-white font-semibold mt-2 p-2 px-5 rounded-full hover:ring-4 hover:ring-blue-300"
        >
          Save Information
        </button>
      </div>
      {/* Avatar Upload Section */}
      <div className="flex items-center">
        <button
          onClick={handleButtonClick}
          className="ml-4 text-white px-4 py-2 rounded-md"
        >
          Upload Avatar
        </button>
        <input
          type="file"
          id="avatar"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleAvatarChange}
        />
      </div>
    </div>
  );
}
