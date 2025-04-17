import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { wardIdState } from "../../../atoms/technicianTask/tasksState";
import technicianService from "../../../services/technicianprofile.service";
import { Table, Tag, Breadcrumb, Input, Modal, message, Select } from "antd";
const { Option } = Select;
import { AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import manageStatisticInfoService from "../../../services/manageStatisticInfo.service";
import manageAlltechnicianService from "../../../services/manageAlltechnician.service";
const api_url = "https://exotic-strong-viper.ngrok-free.app";

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
  const [selectedStatus, setSelectedStatus] = useState<string>("Not start");

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalReportVisible, setIsModalReportVisible] = useState(false);
  const [selectedRoadId, setSelectedRoadId] = useState<string | null>(null);
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
            status: roadData.status,
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

  // UPDATE ROAD STATUS
  const handleUpdateRoadStatus = async (roadId: string, status: string) => {
    try {
      const response = await manageAlltechnicianService.updateStatusRoad(
        roadId,
        status
      );
      if (
        response.status.toString() === "Done" ||
        response.status.toString() === "In progress" ||
        response.status.toString() === "Not start"
      ) {
        message.success("Road status updated successfully");
      } else {
        message.error("Error updating road status");
      }
      fetchTasksAndRoads();
    } catch (error) {
      console.error("Error updating road status:", error);
    }
  };
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };
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
      title: (
        <span
          style={{ color: "#23038C", fontWeight: "bold", fontSize: "16px" }}
        >
          Status
        </span>
      ),
      dataIndex: "status",
      key: "status",
      width: 100,
      align: "center" as "center",
      render: (text: string) => (
        <Tag
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            padding: "5px 10px",
            textTransform: "capitalize",
          }}
          color={getLevelColor(text)}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Report",
      align: "center" as "center",
      render: (_text: any, record: any) => (
        <button
          className="text-green-500"
          onClick={() => {
            setSelectedRoadId(record.road_id);
            setIsModalReportVisible(true);
          }}
        >
          <AiOutlinePlus className="w-5 h-5" />
        </button>
      ),
      width: 80,
    },
    {
      title: (
        <span
          style={{ color: "#23038C", fontWeight: "bold", fontSize: "16px" }}
        >
          Action
        </span>
      ),
      key: "action",
      width: 50,
      align: "center" as "center",
      render: (_: any, record: any) => (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (record.level !== "Good" || record.status !== "Done") {
                setIsModalVisible(true);
                setSelectedRoadId(record.road_id);
              }
            }}
            className={`${
              record.level === "Good" && record.status === "Done"
                ? "text-gray-400 cursor-not-allowed"
                : "text-red-500"
            }`}
            disabled={record.level === "Good" && record.status === "Done"}
          >
            <AiOutlineEdit className="w-5 h-5" />
          </button>
          {editStatusRoad}
        </div>
      ),
    },
  ];

  const handleModalCancel = () => {
    setIsModalReportVisible(false);
    setReport({
      cost: "",
      totalCost: "",
      deviation: "",
      difficulty: "",
      improvement: "",
    }); // Reset the report input fields
  };

  const handleModalOk = async () => {
    if (!selectedRoadId) {
      console.error("No road selected.");
      return;
    }

    const requestBody = {
      total_cost: report.totalCost,
      incidental_costs: report.deviation,
      difficult: report.difficulty,
      propose: report.improvement,
    };

    try {
      await manageStatisticInfoService.uploadReport(
        selectedRoadId,
        selectedStatus,
        requestBody
      );
      console.log("Report submitted successfully:", requestBody);

      setIsModalReportVisible(false);
      setReport({
        cost: "",
        totalCost: "",
        deviation: "",
        difficulty: "",
        improvement: "",
      });
      fetchTasksAndRoads(); // Reload data
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  const editStatusRoad = (
    <Modal
      visible={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      onOk={() => {
        if (selectedRoadId && selectedStatus) {
          handleUpdateRoadStatus(selectedRoadId, selectedStatus);
        }
        setIsModalVisible(false);
      }}
    >
      <h1 className="font-bold text-xl mb-4">Update road status</h1>
      <div className="flex flex-col gap-2">
        <label className="font-semibold mt-2">Select state</label>
        <Select
          placeholder="Select status"
          onChange={handleStatusChange}
          value={selectedStatus}
          style={{ width: "100%" }}
        >
          <Option value="Not start">Not start</Option>
          <Option value="In progress">In progress</Option>
          <Option value="Done">Done</Option>
        </Select>
      </div>
    </Modal>
  );

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
        visible={isModalReportVisible}
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
            placeholder="Phát sinh so với dự kiến"
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
