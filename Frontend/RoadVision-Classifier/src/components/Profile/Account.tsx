import { useEffect, useState } from "react";
import userProfileService from "../../services/userprofile.service";
import { ProfileDataType } from "../../defination/types/profile.type";
import { useRecoilState } from "recoil";
import { profileState } from "../../atoms/profileState";

export default function Account() {
  const [profileData, setProfileData] = useState<ProfileDataType | any>(null); 
  const [loading, setLoading] = useState(true);
  const [, setRecoilProfile] = useRecoilState<any>(profileState);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await userProfileService.getProfile({});

        if (response) {
          setProfileData(response); 
          setRecoilProfile(response);
        } else {
          console.error("API Error: ", response);
          setProfileData(null); 
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setProfileData(null); 
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!profileData) {
    return <div>No profile data available.</div>;
  }

  return (
    <div className="flex flex-col items-center w-full h-80 text-center py-5 gap-10">

      <div className="flex flex-row px-5 justify-between items-center w-[95%] gap-2">
        <div className="w-[30%]">
          <div className="text-left font-normal font-sm text-gray-700 text-sm">Full Name</div>
          <div className="text-left text-black font-medium text-base">
            {profileData.fullname || "N/A"}
          </div>
        </div>
        <div className="w-[30%]">
          <div className="text-left font-normal font-sm text-gray-700 text-sm">Phone Number</div>
          <div className="text-left text-black font-medium text-base">
            {profileData.phonenumber|| "N/A"}
          </div>
        </div>
        <div className="w-[30%]">
          <div className="text-left font-normal font-sm text-gray-700 text-sm">Email</div>
          <div className="text-left text-black font-medium text-base">
            {profileData.email || "N/A"}
          </div>
        </div>
      </div>

      <div className="flex flex-row px-5 justify-between items-center w-[95%] gap-2">
        <div className="w-[30%]">
          <div className="text-left font-normal font-sm text-gray-700 text-sm">Date of Birth</div>
          <div className="text-left text-black font-medium text-base">
            {profileData.birthday || "N/A"}
          </div>
        </div>
        <div className="w-[30%]">
          <div className="text-left font-normal font-sm text-gray-700 text-sm">Gender</div>
          <div className="text-left text-black font-medium text-base">
            {profileData.gender || "N/A"}
          </div>
        </div>
        <div className="w-[30%]">
          <div className="text-left font-normal font-sm text-gray-700 text-sm">Address</div>
          <div className="text-left text-black font-medium text-base">
            {profileData.location || "N/A"}
          </div>
        </div>
      </div>

      <div className="flex flex-row px-5 justify-between items-center w-[95%] gap-2">
        <div className="w-[30%]">
          <div className="text-left font-normal font-sm text-gray-700 text-sm">Join Date</div>
          <div className="text-left text-black font-medium text-base">
            {profileData.created || "N/A"}
          </div>
        </div>
        <div className="w-[30%]">
          <div className="text-left font-normal font-sm text-gray-700 text-sm">Contribution</div>
          <div className="text-left text-black font-medium text-base">
            {profileData.contribution || "N/A"}
          </div>
        </div>
        <div className="w-[30%]">
          <div className="text-left font-normal font-sm text-gray-700 text-sm">State</div>
          <div className="text-left text-black font-medium text-base">
            {profileData.state || "N/A"}
          </div>
        </div>
      </div>

      <div>
        {/* <button className="w-fit bg-[#3749A6] text-white font-semibold p-2 px-5 rounded-full hover:ring-4 hover:ring-blue-300">
          Delete Account
        </button> */}
      </div>
    </div>
  );
}