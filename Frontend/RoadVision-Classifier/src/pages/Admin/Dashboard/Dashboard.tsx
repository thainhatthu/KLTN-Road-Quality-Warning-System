import { AppLayout } from "../../../components/ADMIN/Common/AppLayout";
import DashboardComponent from "../../../components/ADMIN/Dashboard/DashboardComponent";
import homeheader from "../../../assets/img/ADMIN-header.png";
import mask from "../../../assets/img/mask.png";
import UserAndContributionCharts from "../../../components/ADMIN/Dashboard/UserChart";
import TechnicianTaskChart from "../../../components/ADMIN/Dashboard/TechnicianChart";
const Dashboard: React.FC = () => {
  return (
    <AppLayout>
      <div className="w-full min-h-screen bg-[#F9F9F9] flex flex-col p-5 gap-5 justify-start items-center overflow-y-auto">
        {/* HEADER */}
        <div className="flex flex-row w-[100%] h-44 rounded-2xl bg-[#2D82C6] justify-between relative">
          <img
            src={mask}
            className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
          />

          <div className="relative z-100 w-full flex xl:flex-row justify-between">
            {/* content */}
            <div className="flex flex-col p-10 justify-between">
              <div>
                <p className="text-4xl font-bold text-white">
                  Welcome to RoadVision Classifier
                </p>
                <p className="text-white">
                  Let's take a look at the overall statistics.
                </p>
              </div>
              <div className="flex flex-row gap-4"></div>
            </div>
            {/* image */}
            <img
              src={homeheader}
              className="xl:h-full xl:block hidden p-2 mr-10 "
            />
          </div>
        </div>
        <div className="flex w-full flex-row justify-between gap-5">
        <DashboardComponent />
        <UserAndContributionCharts />
        <TechnicianTaskChart />
        </div>

      </div>
    </AppLayout>
  );
};

export default Dashboard;
