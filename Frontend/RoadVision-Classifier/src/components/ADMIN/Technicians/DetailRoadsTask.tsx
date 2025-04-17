import { Breadcrumb, Input, Modal, Select, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { wardIdState } from "../../../atoms/technicianTask/tasksState";
import technicianService from "../../../services/technicianprofile.service";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import manageAlltechnicianService from "../../../services/manageAlltechnician.service";
import { message } from "antd";
const api_url = "https://exotic-strong-viper.ngrok-free.app"

interface AllTaskDetailProps {
  task: any;
  technician: any;
  onBackToTechnicianInfo: () => void;
  onBackToAllTechnicians: () => void;
}
const { Option } = Select;
const DetailRoadsTask = ({
  task,
  technician,
  onBackToTechnicianInfo,
  onBackToAllTechnicians,
}: AllTaskDetailProps) => {
  const wardId = useRecoilValue(wardIdState);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("Not start");
  const [selectedRoadId, setSelectedRoadId] = useState<string>("");
  const [filteredDataSource, setFilteredDataSource] = useState<any[]>([]);
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  // GET ALL ROADS
  const fetchAllRoadsTask = async () => {
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
  useEffect(() => {
    fetchAllRoadsTask();
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
      fetchAllRoadsTask();
    } catch (error) {
      console.error("Error updating road status:", error);
    }
  };
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
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

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Very poor":
        return "red";
      case "Poor":
        return "orange";
      case "Satisfactory":
        return "blue";
      case "Done":
        return "green";
      case "Not start":
        return "gray";
      case "In progress":
        return "blue";
      default:
        return "default";
    }
  };

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
      width: 50,
      align: "center" as "center",
    },
    {
      title: (
        <span
          style={{ color: "#23038C", fontWeight: "bold", fontSize: "16px" }}
        >
          ROAD IMAGE
        </span>
      ),
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
                alignSelf: "center",
                width: 350,
                height: 300,
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
          LOCATION
        </span>
      ),
      dataIndex: "location",
      key: "location",
      width: 200,
      align: "center" as "center",
    },
    {
      title: (
        <span
          style={{ color: "#23038C", fontWeight: "bold", fontSize: "16px" }}
        >
          LEVEL
        </span>
      ),
      dataIndex: "level",
      key: "level",
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
      title: (
        <span
          style={{ color: "#23038C", fontWeight: "bold", fontSize: "16px" }}
        >
          STATUS
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
      title: (
        <span
          style={{ color: "#23038C", fontWeight: "bold", fontSize: "16px" }}
        >
          ACTION
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
            }}
            className="text-red-500"
          >
            <AiOutlineDelete className="w-5 h-5" />
          </button>
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

  // HANDLE FILTER
  const applyFilters = () => {
    let filteredData = dataSource;

    // Filter by search query
    if (searchQuery) {
      filteredData = filteredData.filter((item) =>
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by level
    if (levelFilter) {
      filteredData = filteredData.filter((item) => item.level === levelFilter);
    }

    // Filter by status
    if (statusFilter) {
      filteredData = filteredData.filter(
        (item) => item.status === statusFilter
      );
    }

    setFilteredDataSource(filteredData);
  };
  useEffect(() => {
    applyFilters();
  }, [searchQuery, levelFilter, statusFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleLevelFilterChange = (value: string | null) => {
    setLevelFilter(value);
  };

  const handleStatusFilterChange = (value: string | null) => {
    setStatusFilter(value);
  };

  return (
    <div className="w-full h-full flex flex-col gap-5 justify-start items-center overflow-y-auto">
      <Breadcrumb
        className="w-full justify-start "
        separator=">"
        items={[
          {
            title: "All Technicians",
            onClick: onBackToAllTechnicians,
            className: "cursor-pointer",
          },
          {
            title: technician.username || "Technician Info",
            onClick: onBackToTechnicianInfo,
            className: "cursor-pointer",
          },
          {
            title: `Task ID: ${task.task_id}` || "Task Info",
            className: "text-[#23038C]",
          },
        ]}
      />
      <div className="flex flex-col gap-5 w-full  bg-white rounded-lg shadow-md">
        <div className="w-full bg-[#23038C] text-white py-4 px-10 rounded-lg shadow-md flex justify-between items-center">
          <h2 className="text-3xl font-bold"> All roads </h2>
          <p className="text-lg font-light">
            Comprehensive information about the selected ward
          </p>
        </div>
        <div className="w-full px-10 mb-10">
          <div className="flex justify-between items-center mb-4">
            {/* Search Input */}
            <Input
              placeholder="Search by Road Name"
              value={searchQuery}
              onChange={handleSearch}
              style={{
                width: "40%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #d9d9d9",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            />

            {/* Filters Container */}
            <div className="flex gap-4 items-center">
              {/* Level Filter */}
              <Select
                placeholder="Filter by Level"
                allowClear
                onChange={handleLevelFilterChange}
                style={{
                  width: "200px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
                dropdownStyle={{ borderRadius: "8px" }}
              >
                <Option value="Very poor">Very poor</Option>
                <Option value="Poor">Poor</Option>
                <Option value="Satisfactory">Satisfactory</Option>
                <Option value="Good">Good</Option>
              </Select>

              {/* Status Filter */}
              <Select
                placeholder="Filter by Status"
                allowClear
                onChange={handleStatusFilterChange}
                style={{
                  width: "200px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
                dropdownStyle={{ borderRadius: "8px" }}
              >
                <Option value="Not start">Not start</Option>
                <Option value="In progress">In progress</Option>
                <Option value="Done">Done</Option>
              </Select>
            </div>
          </div>

          <Table
            dataSource={filteredDataSource}
            columns={columns}
            loading={loading}
            pagination={{ pageSize: 5 }}
            rowKey="road_id"
            className="w-[100%] bg-white p-5 rounded-2xl shadow-md"
          />
        </div>
      </div>
      <div className="w-full flex justify-end"></div>
    </div>
  );
};

export default DetailRoadsTask;
