import React, { useEffect, useState } from "react";
import { Table, Progress, Tag } from "antd"; // Import Tag from Ant Design
import { FaUser } from "react-icons/fa";
import technicianprofileService from "../../../services/technicianprofile.service";
import { useSetRecoilState } from "recoil";
import { wardIdState } from "../../../atoms/technicianTask/tasksState";

interface DataType {
  key: React.Key;
  location: string;
  status: string;
  deadline: string;
  ward_id: number;
  road_done: number;
  all_road: number;
}

interface AllUserProps {
  onViewUserInfo: (user: DataType) => void;
}

export default function AllStreetComponent({ onViewUserInfo }: AllUserProps) {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const setWardId = useSetRecoilState(wardIdState);

  const fetchAllRoadsTask = async () => {
    setLoading(true);
    try {
      const response = await technicianprofileService.getAllTask({});
      const taskArray = Array.isArray(response) ? response : response.data;

      const tasks = taskArray.map((task: any) => ({
        key: task.task_id,
        ward_id: task.ward_id,
        location: task.location,
        status: task.status,
        deadline: task.deadline,
        road_done: task.road_done,
        all_road: task.all_road,
      }));

      setDataSource(tasks);
    } catch (error) {
      console.error("Không thể lấy danh sách task của technician!", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRoadsTask();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Not Start":
        return "gray";
      case "Done":
        return "green";
      case "In Progress":
        return "yellow";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Ward ID",
      dataIndex: "ward_id",
      key: "ward_id",
      align: "center" as "center",
    },
    {
      title: "Address",
      dataIndex: "location",
      key: "location",
      align: "center" as "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as "center",
      render: (status: string) => {
        return <Tag color={getStatusColor(status)}>{status}</Tag>;
      },
    },
    {
      title: "Due Date",
      dataIndex: "deadline",
      key: "deadline",
      align: "center" as "center",
    },
    {
      title: "Progress",
      dataIndex: "road_done",
      key: "road_done",
      align: "center" as "center",
      render: (_text: number, record: any) => {
        const percentage = Math.round((record.road_done / record.all_road) * 100);
        return (
          <div>
            <Progress percent={percentage} status="active" />
            <span>{record.road_done}/{record.all_road}</span>
          </div>
        );
      },
    }
  ];

  return (
    <div className="w-full h-screen flex flex-col gap-5 justify-start items-center overflow-y-auto">
      <div className="w-full p-5 bg-white rounded-lg shadow-md">
        <div className="flex flex-row justify-between items-center mb-4">
          <div className="flex flex-row items-center gap-2">
            <FaUser color="#3B82F6" size={20} />
            <h1 className="text-2xl text-blue-500 font-bold">All Roads need to fix</h1>
          </div>
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          loading={loading}
          onRow={(record) => ({
            onClick: () => {
              setWardId(record.ward_id);
              onViewUserInfo(record);
            },
          })}
          rowClassName="cursor-pointer"
        />
      </div>
    </div>
  );
}
