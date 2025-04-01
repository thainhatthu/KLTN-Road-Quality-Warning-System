import { useState } from "react";
import { AppLayout } from "../../../components/TECHNICIAN/Common/AppLayout";
import TaskManagementComponent from "../../../components/TECHNICIAN/TaskManagement/TaskManagementComponent";
import AllStreetComponent from "../../../components/TECHNICIAN/TaskManagement/AllStreetComponent";

export default function TaskManagement() {
  const [currentView, setCurrentView] = useState<"allRoads" | "detailTask">(
    "allRoads"
  );
  const [selectedRoad] = useState<any>(null);
  const handleViewRoadDetails = (road: any) => {
    setCurrentView(road);
    setCurrentView("detailTask");
  };
  const handleBackToAllRoad = () => {
    setCurrentView("allRoads");
  };
  return (
    <AppLayout>
      <div className="p-4 bg-gray-50">
        {currentView === "allRoads" && (
          <AllStreetComponent onViewUserInfo={handleViewRoadDetails} />
        )}
        {currentView === "detailTask" && (
          <TaskManagementComponent
            road={selectedRoad}
            onBack={handleBackToAllRoad}
            onViewRoadDetails={handleViewRoadDetails}
          />
        )}
      </div>
    </AppLayout>
  );
}
