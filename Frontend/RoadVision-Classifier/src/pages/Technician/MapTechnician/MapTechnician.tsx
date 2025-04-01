import { AppLayout } from "../../../components/TECHNICIAN/Common/AppLayout";
import Map from "../../../components/Map/Map.tsx";
const MapTechnician: React.FC = () => {
  return (
    <AppLayout>
      <div className="w-full min-h-screen bg-[#F9F9F9] flex flex-col p-5 gap-5 justify-start items-center overflow-y-auto">
        <Map />
      </div>
    </AppLayout>
  );
};

export default MapTechnician;
