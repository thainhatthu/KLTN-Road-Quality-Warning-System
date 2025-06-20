import { Breadcrumb, message, Modal, Table, Tag } from "antd";
import avt from "../../../assets/img/defaultAvatar.png";
import { useEffect, useState } from "react";
import manageAlluserService from "../../../services/manageAlluser.service";
import { RoadDataType } from "../../../defination/types/alluser.type";
import { format } from "date-fns";
import { AiOutlineDelete } from "react-icons/ai";
import dataService from "../../../services/data.service";

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
const api_url = "https://b151-42-116-6-46.ngrok-free.app";

export default function UserInfo({
  user,
  onBack,
  onViewRoadDetails,
}: AllUserProps) {
  const [dataSource, setDataSource] = useState<RoadDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [contribution, setContribution] = useState(user.contribution || 0); 

  const fetchAllRoads = async () => {
    setLoading(true);
    try {
      const response = await manageAlluserService.getAllRoadInfo(user.user_id);
      if (Array.isArray(response)) {
        if (response.length > 0) {
          const roads = response.map((roadData: string) =>
            JSON.parse(roadData)
          );
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
          setDataSource(extractedRoads || []);
          setContribution(extractedRoads.length);
        } else {
          setDataSource([]);
          setContribution(0);
        }
      } else console.log("Mảng rỗng");
    } catch (error) {
      console.log("Không thể lấy danh sách đường!", error);
    } finally {
      setLoading(false);
    }
  };
  // DELETE ROAD
  const handleDeleteRoad = async (road_id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this road?",
      content: "This action cannot be undone.",
      okText: "Yes, delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await dataService.deleteRoadforAdmin(road_id);
          const updatedDataSource = dataSource.filter(
            (road) => road.road_id !== road_id
          );
          setDataSource(updatedDataSource);
          setContribution(updatedDataSource.length);
          message.success("Road deleted successfully!");
        } catch (error) {
          message.error("Fail to delete road!");
        }
      },
      onCancel: () => {
        console.log("User deletion cancelled");
      },
    });
  };

  useEffect(() => {
    fetchAllRoads();
  }, [user.user_id]);
  const columns = [
    {
      title: (
        <span
          style={{ color: "#23038C", fontWeight: "bold", fontSize: "16px" }}
        >
          ROAD ID
        </span>
      ),
      dataIndex: "road_id",
      key: "road_id",
      width: 100,
      align: "center" as "center",
    },
    {
      title: (
        <span
          style={{ color: "#23038C", fontWeight: "bold", fontSize: "16px" }}
        >
          IMAGE
        </span>
      ),
      dataIndex: "road_image",
      key: "road_image",
      render: (text: string) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={text}
            alt="Road"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
        </div>
      ),
      align: "center" as "center",
      width: 200,
    },
    {
      title: (
        <span
          style={{ color: "#23038C", fontWeight: "bold", fontSize: "16px" }}
        >
          TYPE
        </span>
      ),
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
      title: (
        <span
          style={{ color: "#23038C", fontWeight: "bold", fontSize: "16px" }}
        >
          DATE UPLOAD
        </span>
      ),
      dataIndex: "road_time",
      key: "road_time",
      align: "center" as "center",
      width: 200,
    },
    {
      title: (
        <span
          style={{ color: "#23038C", fontWeight: "bold", fontSize: "16px" }}
        >
          LOCATION
        </span>
      ),
      dataIndex: "road_location",
      key: "road_location",
      align: "center" as "center",
      width: 300,
    },
    {
      title: (
        <span
          style={{ color: "#23038C", fontWeight: "bold", fontSize: "16px" }}
        >
          ACTION
        </span>
      ),
      align: "center" as "center",
      render: (record: any) => (
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteRoad(record.road_id);
            }}
            className="text-red-500"
          >
            <AiOutlineDelete className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];
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
            className: "text-[#23038C]",
          },
        ]}
      />
      <div className="relative flex flex-row gap-5 w-[95%] h-48 px-10 rounded-2xl bg-[#3749A6] justify-between items-center">
        <div className="absolute bg-white rounded-full w-36 h-36 flex justify-center items-center">
        <img
          src={user.avatar}
          alt="Avatar"
          className="w-[95%] h-[95%] object-cover rounded-full"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = avt;
          }}
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
            Contribution: {contribution}
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
                onViewRoadDetails(record);
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
