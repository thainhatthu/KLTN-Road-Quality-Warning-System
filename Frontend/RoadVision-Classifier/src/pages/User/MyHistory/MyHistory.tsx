import AppLayout from "../../../components/Common/AppLayout";
import mask from "../../../assets/img/mask.png"; // Adjust the path as necessary
import homeheader from "../../../assets/img/history.png";
import History from "../../../components/MyHistory/MyHistory";

export default function MyHistory() {
  return (
    <AppLayout>
      <div className="w-full min-h-screen bg-[#F9F9F9] flex flex-col p-5 gap-5 justify-start items-center overflow-y-auto">
        {/* HEADER */}
        <div className="flex flex-row w-[95%] h-40 rounded-2xl bg-[#2D82C6] justify-between relative">
          <img
            src={mask}
            className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
          />
          <div className="relative z-100 w-full flex flex-row justify-between">
            {/* content */}
            <div className="flex flex-col p-10 justify-between">
              <div>
                <p className="text-4xl font-bold text-white">
                  Your upload history!
                </p>
                <p className="text-white">---------------------</p>
              </div>
            </div>
            {/* image */}
            <img src={homeheader} className="p-2 mr-10 h-full" />
          </div>
        </div>
        {/* BODY */}
        <div className="bg-white w-[95%] h-full rounded-2xl">
          <History />
        </div>
      </div>
    </AppLayout>
  );
}
