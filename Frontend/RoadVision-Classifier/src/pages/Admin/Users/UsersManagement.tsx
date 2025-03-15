import React, { useState } from "react";
import { AppLayout } from "../../../components/ADMIN/Common/AppLayout";
import AllUser from "../../../components/ADMIN/Users/AllUser";
import UserInfo from "../../../components/ADMIN/Users/UserInfo";
import RoadDetails from "../../../components/ADMIN/Users/RoadDetails";
import { useRecoilState } from "recoil";
import { userState } from "../../../atoms/admin/accountState";

const UsersManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<
    "allUsers" | "userInfo" | "roadDetails"
  >("allUsers");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [currentRoad, setCurrentRoad] = useState<any>(null);
  const [userinf, setUser] = useRecoilState(userState);

  // VIEW USER INFO
  const handleViewUserInfo = (user: any) => {
    setSelectedUser(user);
    setUser(user);
    setCurrentView("userInfo");
  };

  const handleBackToAllUsers = () => {
    setCurrentView("allUsers");
  };

  // VIEW ROAD DETAILS
  const handleViewRoadDetails = (road: any) => {
    setCurrentRoad(road);
    setCurrentView("roadDetails");
  };

  const handleBackToUserInfo = () => {
    setCurrentView("userInfo");
  };

  return (
    <AppLayout>
      <div className="w-full min-h-screen bg-[#F9F9F9] flex flex-col p-5 gap-5 justify-start items-center overflow-y-auto">
        
        {currentView === "allUsers" && (
          <AllUser onViewUserInfo={handleViewUserInfo} />
        )}
        {currentView === "userInfo" && (
          <UserInfo
            user={selectedUser}
            onBack={handleBackToAllUsers}
            onViewRoadDetails={handleViewRoadDetails}
          />
        )}
        {currentView === "roadDetails" && (
          <RoadDetails
            user={userinf}
            road={currentRoad}
            onBackToUsers={handleBackToAllUsers}
            onBackToUserInfo={handleBackToUserInfo}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default UsersManagement;
