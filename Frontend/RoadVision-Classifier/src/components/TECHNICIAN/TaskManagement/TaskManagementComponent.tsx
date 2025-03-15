import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { wardIdState } from "../../../atoms/technicianTask/tasksState";
import technicianService from "../../../services/technicianprofile.service";
import { Table, Tag, Breadcrumb, Input, Modal } from "antd";
import { AiOutlinePlus } from "react-icons/ai";
const api_url = import.meta.env.VITE_BASE_URL;

interface TaskManagementComponentProps {
  road: any;
  onBack: () => void;
  onViewRoadDetails: (road: any) => void;
}

const TaskManagementComponent: React.FC<TaskManagementComponentProps> = ({
  onBack,
}) => {
  const wardId = useRecoilValue(wardIdState);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState<any[]>([]);

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [report, setReport] = useState({
    cost: "",
    totalCost: "",
    deviation: "",
    difficulty: "",
    improvement: "",
  });

  const fetchTasksAndRoads = async () => {
    if (wardId !== null) {
      setLoading(true);
      try {
        const response = await technicianService.getAllRoad(wardId);
        const roads = Array.isArray(response) ? response : response.data;

        const parsedRoads = roads.map((road: string) => {
          const roadData = JSON.parse(road);
          return {
            road_id: roadData.id,
            location: roadData.location,
            level: roadData.level,
            road_image: roadData.filepath,
            task_deadline: roadData.created_at,
          };
        });

        setDataSource(parsedRoads);
        setFilteredDataSource(parsedRoads);
      } catch (error) {
        console.error("Error fetching road data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      const filteredData = dataSource.filter((item) =>
        item.location.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDataSource(filteredData);
    } else {
      setFilteredDataSource(dataSource);
    }
  };

  useEffect(() => {
    fetchTasksAndRoads();
  }, [wardId]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Very poor":
        return "red";
      case "Poor":
        return "yellow";
      case "Satisfactory":
        return "blue";
      case "Done":
        return "green";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Road ID",
      dataIndex: "road_id",
      key: "road_id",
      width: 100,
      align: "center" as "center",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: 250,
      align: "center" as "center",
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      width: 100,
      align: "center" as "center",
      render: (text: string) => <Tag color={getLevelColor(text)}>{text}</Tag>,
    },
    {
      title: "Road Image",
      dataIndex: "road_image",
      key: "road_image",
      width: 250,
      align: "center" as "center",
      render: (image: string) => {
        const fullImageUrl = `${api_url}/${image}`;
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={fullImageUrl}
              alt="Road"
              style={{
                width: 150,
                height: 100,
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        );
      },
    },
    {
      title: "Report",
      align: "center" as "center",
      render: () => (
        <button
          className="text-green-500"
          onClick={() => setIsModalVisible(true)}
        >
          <AiOutlinePlus className="w-5 h-5" />
        </button>
      ),
      width: 80,
    },
  ];

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setReport({
      cost: "",
      totalCost: "",
      deviation: "",
      difficulty: "",
      improvement: "",
    }); // Reset the report input fields
  };

  const handleModalOk = () => {
    // Handle the submission of the report here (e.g., send to API)
    console.log("Report submitted:", report);
    setIsModalVisible(false);
    setReport({
      cost: "",
      totalCost: "",
      deviation: "",
      difficulty: "",
      improvement: "",
    }); // Clear report fields after submission
  };

  return (
    <div className="w-full min-h-screen bg-[#F9F9F9] flex flex-col gap-5 justify-start items-center overflow-y-auto">
      <Breadcrumb
        className="w-full justify-start px-10"
        separator=">"
        items={[
          { title: "All Users", onClick: onBack, className: "cursor-pointer" },
          { title: "Task Management", className: "cursor-pointer" },
        ]}
      />
      <Input
        placeholder="Search by Road Name"
        value={searchQuery}
        onChange={handleSearch}
        style={{ width: "80%", margin: "10px 0" }}
      />
      <Table
        dataSource={filteredDataSource}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 5 }}
        rowKey="road_id"
        className="w-[95%] bg-white p-5 rounded-2xl shadow-md"
      />

      {/* Modal for report */}
      <Modal
        title="Write Report"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
        okText="Submit"
        cancelText="Cancel"
      >
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Tổng chi phí"
            value={report.totalCost}
            onChange={(e) =>
              setReport({ ...report, totalCost: e.target.value })
            }
          />
          <Input
            placeholder="Phát sinh so với thực tế"
            value={report.deviation}
            onChange={(e) =>
              setReport({ ...report, deviation: e.target.value })
            }
          />
          <Input
            placeholder="Khó khăn gặp phải"
            value={report.difficulty}
            onChange={(e) =>
              setReport({ ...report, difficulty: e.target.value })
            }
          />
          <Input
            placeholder="Đề xuất cải thiện (Nếu có)"
            value={report.improvement}
            onChange={(e) =>
              setReport({ ...report, improvement: e.target.value })
            }
          />
        </div>
      </Modal>
    </div>
  );
};

export default TaskManagementComponent;
