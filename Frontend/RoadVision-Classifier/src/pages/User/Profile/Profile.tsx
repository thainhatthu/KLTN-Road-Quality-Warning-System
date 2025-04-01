import { useState } from "react";
import AppLayout from "../../../components/Common/AppLayout";
import defaultAvatar from "../../../assets/img/defaultAvatar.png";
import mask from "../../../assets/img/mask.png";
import Account from "../../../components/Profile/Account";
import EditProfile from "../../../components/Profile/EditProfile";
import History from "../../../components/Profile/History";
import ChangePassword from "../../../components/Profile/ChangePassword";
import { useRecoilValue } from "recoil";
import { accountState } from "../../../atoms/authState";

export default function Profile() {
  const userRecoilStateValue = useRecoilValue(accountState);
  const [activeTab, setActiveTab] = useState(0);
  const avatar = userRecoilStateValue.avatar;
  // All Tabs
  const tabs = [
    { label: "Account", component: <Account /> },
    { label: "Edit Profile", component: <EditProfile /> },
    { label: "Change Password", component: <ChangePassword /> },
    { label: "History", component: <History /> },
  ];

  return (
    <AppLayout>
      <div className="w-full min-h-screen bg-[#F9F9F9] flex flex-col gap-5 justify-start items-center overflow-y-auto">
        {/* Header */}
        <div className="flex flex-row w-[95%] h-32 rounded-2xl bg-[#2D82C6] justify-center items-center relative">
          <img
            src={mask}
            className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
          />
          <div className="absolute bg-white rounded-full top-[40%] w-36 h-36 flex justify-center items-center">
            <img
              src={avatar || defaultAvatar}
              alt="Avatar"
              className="w-[95%] h-[95%] object-cover rounded-full"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="flex flex-col mt-12">
          <h1 className="text-center text-lg font-semibold">
            {userRecoilStateValue.username}
          </h1>
          <h2 className="text-center text-gray-600 text-sm font-semibold">
            {userRecoilStateValue.email}
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-row items-center px-5 justify-between h-12 w-[95%] rounded-lg shadow bg-white">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`text-center font-medium w-[23%] cursor-pointer py-2 ${
                activeTab === index
                  ? "border-b-2 border-blue-500"
                  : "border-b-2 border-transparent"
              }`}
              onClick={() => setActiveTab(index)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* Tab component */}
        <div className="w-[95%] bg-white rounded-lg p-5 shadow">
          {tabs[activeTab].component}
        </div>
      </div>
    </AppLayout>
  );
}
