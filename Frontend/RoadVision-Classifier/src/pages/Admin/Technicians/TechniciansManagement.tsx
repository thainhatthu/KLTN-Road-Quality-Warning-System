import React, { useState } from "react";
import { AppLayout } from "../../../components/ADMIN/Common/AppLayout";
import AllTechnicians from "../../../components/ADMIN/Technicians/AllTechnicians";
import TechnicianInfo from "../../../components/ADMIN/Technicians/TechnicianInfo";
import DetailRoadsTask from "../../../components/ADMIN/Technicians/DetailRoadsTask";


const TechniciansManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<
    "allTechnicians" | "technicianInfo" | "tasksDetail"
  >("allTechnicians");
  const [selectedTechnician, setselectedTechnician] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const handleViewTechnicianInfo = (user: any) => {
    setselectedTechnician(user);
    setCurrentView("technicianInfo");
  };

  const handleViewTaskDetail = (task: any) => {
    setSelectedTask(task);
    setCurrentView("tasksDetail");
  }

  const handleBackToAllTechnicians = () => {
    setCurrentView("allTechnicians");
  };

  return (
    <AppLayout>
      <div className="w-full min-h-screen bg-[#F9F9F9] flex flex-col p-5 gap-5 justify-start items-center overflow-y-auto">        
      {currentView === "allTechnicians" && (
          <AllTechnicians onViewTechnicianInfo={handleViewTechnicianInfo} />
        )}
        {currentView === "technicianInfo" && (
          <TechnicianInfo
            technician={selectedTechnician}
            onBack={handleBackToAllTechnicians}
            onViewTaskDetails={handleViewTaskDetail}
          />
        )}
        {currentView === "tasksDetail" && (
          <DetailRoadsTask
            task={selectedTask}
            technician={selectedTechnician}
            onBackToTechnicianInfo={() => handleViewTechnicianInfo(selectedTechnician)}
            onBackToAllTechnicians={handleBackToAllTechnicians}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default TechniciansManagement;
