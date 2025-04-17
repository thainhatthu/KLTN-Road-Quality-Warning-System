import { Breadcrumb, Table, Tag } from "antd";
import avt from "../../../assets/img/defaultAvatar.png";
import { useEffect, useState } from "react";
import manageAlluserService from "../../../services/manageAlluser.service";
import { RoadDataType } from "../../../defination/types/alluser.type";
import { format } from "date-fns";
import { AiOutlineDelete } from "react-icons/ai";
interface DataType {
  key: React.Key;
  user_id: number;
  username: string;
  fullname: string;
  joindate: string;
  contribution: number;
  avatar: string;
}
interface AllUserProps {
  user: DataType;
  onBack: () => void;
  onViewRoadDetails: (road: any) => void;
}
const api_url =  import.meta.env.VITE_BASE_URL;
const columns = [
  {
    title: "Road ID",
    dataIndex: "road_id",
    key: "road_id",
    width: 100,
    align: "center" as "center",
  },
  {
    title: "Image",
    dataIndex: "road_image",
    key: "road_image",
    render: (text: string) => (
      <img
        src={text}
        alt="Road"
        style={{ width: "80px", height: "50px", objectFit: "cover" }}
      />
    ),
    align: "center" as "center",
  },
  {
    title: "Type",
    dataIndex: "road_type",
    key: "road_type",
    align: "center" as "center",
    render: (text: string) => {
      const colorMap: { [key: string]: string } = {
        Good: "green",
        Satisfactory: "blue",
        Poor: "orange",
        "Very poor": "red",
      };
      return <Tag color={colorMap[text] || "default"}>{text}</Tag>;
    },
  },
  {
    title: "Date Uploaded",
    dataIndex: "road_time",
    key: "road_time",
    align: "center" as "center",
  },
  {
    title: "Location",
    dataIndex: "road_location",
    key: "road_location",
    align: "center" as "center",
  },
  {
    title: "Action",
    align: "center" as "center",
    render: () => (
      <div>
        <button className="text-red-500">
          <AiOutlineDelete className="w-5 h-5" />
        </button>
      </div>
    ),
  },
];

export default function UserInfo({
  user,
  onBack,
  onViewRoadDetails,
}: AllUserProps) {
  const [dataSource, setDataSource] = useState<RoadDataType[]>([]);
  const [loading, setLoading] = useState(false);

  // GET ROAD LIST
  const fetchAllRoads = async () => {
    setLoading(true);
    try {
      const response = await manageAlluserService.getAllRoadInfo(user.user_id);
      console.log("response", response);
      if (Array.isArray(response)) {
        if (response.length > 0) {
          const roads = response.map((roadData: string) =>
            JSON.parse(roadData)
          );
          console.log("roads", roads);
          const extractedRoads = roads.map((road) => ({
            key: road.id,
            road_id: road.id,
            road_image: `${api_url}/${road.filepath}`,
            road_type: road.level,
            road_time: format(new Date(road.created_at), "dd/MM/yyyy HH:mm:ss"),
            road_location: road.location,
            road_lat: road.latitude,
            road_long: road.longitude,
            road_status: road.status,
          }));

          console.log("Extracted roads", extractedRoads);
          setDataSource(extractedRoads || []);
        }
      } else console.log("Mảng rỗng");
    } catch (error) {
      console.log("Không thể lấy danh sách đường!", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRoads();
  }, [user.user_id]);

  return (
    <div className="w-full min-h-screen bg-[#F9F9F9] flex flex-col gap-5 justify-start items-center overflow-y-auto">
      <Breadcrumb
        className="w-full justify-start px-10"
        separator=">"
        items={[
          {
            title: "All Users",
            onClick: onBack,
            className: "cursor-pointer",
          },
          {
            title: user.username || "User Info",
            className: "text-[#23038C]"
          },
        ]}
      />
      <div className="relative flex flex-row gap-5 w-[95%] h-48 px-10 rounded-2xl bg-[#3749A6] justify-between items-center">
        <div className="absolute bg-white rounded-full w-36 h-36 flex justify-center items-center">
          <img
            src={user.avatar || avt}
            alt="Avatar"
            className="w-[95%] h-[95%] object-cover rounded-full"
          />
        </div>
        <div className="flex flex-col justify-between ml-40">
          <div className="text-white font-bold text-2xl">
            {user.fullname || ""}
          </div>
          <div className="text-white font-normal text-base">
            {user.username || ""}
          </div>
          <div className="text-white font-normal text-base">
            Contribution: {user.contribution || ""}
          </div>
        </div>
      </div>
      <div className="w-[95%] bg-white p-5 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Roads Information</h2>
        <Table
          dataSource={dataSource}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 5 }}
          rowKey="road_id"
          onRow={(record) => ({
            onClick: () => {
              if (onViewRoadDetails) {
                onViewRoadDetails(record); // Gọi hàm khi nhấp vào hàng
              } else {
                console.error("onViewRoadDetails is not defined");
              }
            },
          })}
        />
      </div>
    </div>
  );
}
