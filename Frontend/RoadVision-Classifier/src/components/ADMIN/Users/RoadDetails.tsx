import { Breadcrumb } from "antd";
import React from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../../../atoms/admin/accountState";
import MapComponent from "./MapComponent";

interface RoadDetailsProps {
  road: any;
  user: any;
  onBackToUsers: () => void;
  onBackToUserInfo: () => void;
}

const RoadDetails: React.FC<RoadDetailsProps> = ({
  road,
  onBackToUserInfo,
  onBackToUsers,
}) => {
  const user = useRecoilValue(userState);
  return (
    <div className="w-full h-full flex flex-col gap-5 justify-start items-center overflow-y-auto">
      <Breadcrumb
        className="w-full justify-start px-10"
        separator=">"
        items={[
          {
            title: "All Users",
            onClick: onBackToUsers,
            className: "cursor-pointer",
          },
          {
            title: user?.username || "User Info",
            onClick: onBackToUserInfo,
            className: "cursor-pointer",
          },
          {
            title: `Road ID: ${road.road_id}` || "Road Info",
            className: "text-[#23038C]",
          },
        ]}
      />

      <div className="flex flex-col gap-5 w-full  bg-white rounded-lg shadow-md">
        <div className="w-full bg-[#23038C] text-white py-4 px-10 rounded-lg shadow-md flex justify-between items-center">
          <h2 className="text-3xl font-bold">Road Details</h2>
          <p className="text-lg font-light">
            Comprehensive information about the selected road
          </p>
        </div>
        <div className="w-full px-20">
          <p>
            <strong className="text-[#23038C]">Road ID:</strong> {road.road_id}
          </p>
          <p>
            <strong className="text-[#23038C]">Type:</strong> {road.road_type}
          </p>
          <p>
            <strong className="text-[#23038C]">Location:</strong>{" "}
            {road.road_location}
          </p>
          <p>
            <strong className="text-[#23038C]">Latitude:</strong>{" "}
            {road.road_lat}
          </p>
          <p>
            <strong className="text-[#23038C]">Longitude:</strong>{" "}
            {road.road_long}
          </p>
          <p>
            <strong className="text-[#23038C]">Status:</strong>{" "}
            {road.road_status}
          </p>
          <p>
            <strong className="text-[#23038C]">Date Uploaded:</strong>{" "}
            {road.road_time}
          </p>
        </div>
        <div className="w-full flex px-20 py-5 flex-col lg:flex-row gap-5">
          <div className="flex-1">
            <img
              src={road.road_image}
              alt="Road"
              style={{
                objectFit: "cover",
                display: "block",
                border: "3px solid #f1f1ff",
              }}
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </div>

          <div className="flex-1">
            <MapComponent latitude={road.road_lat} longitude={road.road_long} />
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end">
        <button
          onClick={onBackToUserInfo}
          className="px-4 py-2 border-2 border-[#23038C] text-[#23038C] rounded-lg"
        >
          Delete Road image
        </button>
      </div>
    </div>
  );
};

export default RoadDetails;
