import { useEffect, useState } from "react";
import { Breadcrumb, message, Table, Tag } from "antd";
import avt from "../../../assets/img/defaultAvatar.png";
import manageStatisticInfoService from "../../../services/manageStatisticInfo.service";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import dataService from "../../../services/data.service";
import { Modal, Select } from "antd";
import { DatePicker } from "antd";
import type { GetProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import manageAlltechnicianService from "../../../services/manageAlltechnician.service";
import { TechiniciansTaskType } from "../../../defination/types/alltechnician.type";

import { useSetRecoilState } from "recoil";
import { wardIdState } from "../../../atoms/technicianTask/tasksState";

// Select Date Time
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
dayjs.extend(customParseFormat);
const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  return current && current < dayjs().endOf("day");
};

//Select Location
const { Option } = Select;
interface TaskType {
  task_id: number;
  status: string;
  ward_id: number;
  district_id: number;
  province_id: number;
  all_road: number;
  road_done: number;
  location: string;
  deadline: string;
}

interface DataType {
  key: React.Key;
  user_id: number;
  username: string;
  fullname: string;
  joindate: string;
  avatar: string;
  tasks: TaskType[];
}

interface AllTechniciansProps {
  technician: DataType;
  onBack: () => void;
  onViewTaskDetails: (task: any) => void;
}

export default function TechnicianInfo({
  technician,
  onBack,
  onViewTaskDetails,
}: AllTechniciansProps) {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [locations, setLocations] = useState<Record<string, any>>({});
  const [selectedProvince, setSelectedProvince] = useState<string>();
  const [selectedDistrict, setSelectedDistrict] = useState<string>();
  const [selectedWard, setSelectedWard] = useState<string>();
  const [selectedDeadline, setSelectedDeadline] = useState<string>();
  const [isModalEditVisible, setIsModalEditVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("Not start");

  const setWardId = useSetRecoilState(wardIdState);

  const resetAssignTaskForm = () => {
    setSelectedProvince(undefined);
    setSelectedDistrict(undefined);
    setSelectedWard(undefined);
    setSelectedDeadline(undefined);
  };

  const resetEditStatusForm = () => {
    setSelectedStatus("Not start");
  };

  useEffect(() => {
    if (isModalVisible) resetAssignTaskForm();
    if (isModalEditVisible) resetEditStatusForm();
  }, [isModalVisible, isModalEditVisible]);

  const handleDateChange = (
    _value: Dayjs | null,
    dateString: string | string[]
  ) => {
    if (Array.isArray(dateString)) {
      setSelectedDeadline(dateString[0]);
    } else {
      setSelectedDeadline(dateString);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await manageStatisticInfoService.getTask({
        user_id: technician.user_id,
      });
      if (Array.isArray(response)) {
        setTasks(response);
      } else {
        console.log("Is not array!:");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchValidWards = async () => {
    try {
      const response = await dataService.getValidWards({});
      setLocations(response || []);
    } catch (error) {}
  };
  useEffect(() => {
    fetchValidWards();
    fetchTasks();
  }, [technician.user_id]);

  /// UPDATE STATUS
  const handleUpdateTaskStatus = async (ward_id: string, status: string) => {
    try {
      const response = await manageAlltechnicianService.updateStatusTask(
        ward_id,
        status
      );
      if (
        response.status.toString() === "Done" ||
        response.status.toString() === "In progress" ||
        response.status.toString() === "Not start"
      ) {
        message.success("Task status updated successfully");
        fetchTasks();
      } else {
        message.error("Error updating task status");
      }
    } catch (error) {
      console.error("Error updating road status:", error);
    }
  };
  const handleStatusTaskChange = (value: string) => {
    setSelectedStatus(value); // Lưu trạng thái mới
  };

  const getLevelColor = (level: string) => {
    switch (level) {
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
          TASK ID
        </span>
      ),
      dataIndex: "task_id",
      key: "task_id",
      align: "center" as "center",
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
      align: "center" as "center",
      width: 200,
    },
    {
      title: (
        <span
          style={{ color: "#23038C", fontWeight: "bold", fontSize: "16px" }}
        >
          WARD ID
        </span>
      ),
      dataIndex: "ward_id",
      key: "ward_id",
      align: "center" as "center",
    },
    {
      title: (
        <span
          style={{ color: "#23038C", fontWeight: "bold", fontSize: "16px" }}
        >
          TOTAL
        </span>
      ),
      dataIndex: "all_road",
      key: "all_road",
      align: "center" as "center",
    },
    {
      title: (
        <span
          style={{ color: "#23038C", fontWeight: "bold", fontSize: "16px" }}
        >
          DONE
        </span>
      ),
      dataIndex: "road_done",
      key: "road_done",
      align: "center" as "center",
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
          DEADLINE
        </span>
      ),
      dataIndex: "deadline",
      key: "deadline",
      align: "center" as "center",
      render: (text: string) => new Date(text).toLocaleString(),
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
      align: "center" as "center",
      render: (_: any, record: TaskType) => (
        <div className="flex gap-3 justify-center">
          {/* Delete Action */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTask(record.task_id);
            }}
            className="text-red-500 hover:text-red-700"
          >
            <AiOutlineDelete className="w-5 h-5" />
          </button>
          {/* Edit Action */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalEditVisible(true);
              setSelectedWard(record.ward_id.toString());
            }}
            className="text-red-500"
          >
            <AiOutlineEdit className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  //PICK LOCATION TO ASSIGN TASK
  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedDistrict("");
    setSelectedWard("");
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setSelectedWard("");
  };

  //ASSIGN TASK
  const handleAssignTask = async () => {
    const formData: TechiniciansTaskType = {
      username: technician.username,
      province_name: selectedProvince,
      district_name: selectedDistrict,
      ward_name: selectedWard,
      deadline: selectedDeadline,
    };

    try {
      const response = await manageAlltechnicianService.assignTask(formData);
      console.log("Response:", response);
      fetchTasks();
      fetchValidWards();
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };
  const assignTaskModal = (
    <Modal
      visible={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      onOk={() => {
        handleAssignTask();
        setIsModalVisible(false);
      }}
    >
      <h1 className="font-bold text-xl mb-4">Assign New Task</h1>
      <div className="flex flex-col gap-2">
        <label className="font-semibold mt-2">Select Valid Province/City</label>
        <Select
          placeholder="Select Province/City"
          onChange={handleProvinceChange}
          value={selectedProvince}
          style={{ width: "100%" }}
        >
          {Object.keys(locations).map((province) => (
            <Option key={province} value={province}>
              {province}
            </Option>
          ))}
        </Select>
        <label className="font-semibold mt-2">Select Valid District</label>
        <Select
          placeholder="Select District"
          onChange={handleDistrictChange}
          value={selectedDistrict}
          disabled={!selectedProvince}
          style={{ width: "100%" }}
        >
          {selectedProvince &&
            Object.keys(locations[selectedProvince] || {}).map((district) => (
              <Option key={district} value={district}>
                {district}
              </Option>
            ))}
        </Select>
        <label className="font-semibold mt-2">Select Valid Ward</label>
        <Select
          placeholder="Select Ward"
          onChange={(value) => setSelectedWard(value)}
          value={selectedWard}
          disabled={!selectedDistrict}
          style={{ width: "100%" }}
        >
          {selectedProvince &&
            selectedDistrict &&
            locations[selectedProvince]?.[selectedDistrict]?.map(
              (ward: string) => (
                <Option key={ward} value={ward}>
                  {ward}
                </Option>
              )
            )}
        </Select>
        <label className="font-semibold mt-2">Deadline</label>
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          disabledDate={disabledDate}
          showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
          onChange={handleDateChange}
          required
        />
      </div>
    </Modal>
  );

  //DELETE TASK
  const handleDeleteTask = async (task_id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this task?",
      content: "This action cannot be undone.",
      okText: "Yes, delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await manageAlltechnicianService.deleteTask(task_id);
          message.success("Task deleted successfully!");
          fetchTasks();
          fetchValidWards();
        } catch (error) {
          message.success("Task deleted successfully!");
        }
      },
      onCancel: () => {
        console.log("User deletion cancelled");
      },
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#F9F9F9] flex flex-col gap-5 justify-start items-center overflow-y-auto">
      <Breadcrumb
        className="w-full justify-start "
        separator=">"
        items={[
          {
            title: "All Technicians",
            onClick: onBack,
            className: "cursor-pointer",
          },
          {
            title: technician.username || "Technician Info",
          },
        ]}
      />
      <div className="relative flex flex-row gap-5 w-[100%] h-48 px-10 rounded-2xl bg-[#3749A6] justify-between items-center">
        <div className="absolute bg-white rounded-full w-36 h-36 flex justify-center items-center">
          <img
            src={technician.avatar || avt}
            alt="Avatar"
            className="w-[95%] h-[95%] object-cover rounded-full"
          />
        </div>
        <div className="flex flex-col justify-between ml-40">
          <div className="text-white font-normal text-base">
            <strong>Technician name:</strong> {technician.username || "N/A"}
          </div>
          <div className="text-white font-normal text-base">
            <strong>Technician ID:</strong> {technician.user_id || "N/A"}
          </div>
          <div className="text-white font-normal text-base">
            <strong>Join date:</strong> {technician.joindate || "N/A"}
          </div>
        </div>
      </div>
      {isModalEditVisible && (
        <Modal
          visible={isModalEditVisible}
          onCancel={() => setIsModalEditVisible(false)}
          onOk={() => {
            if (selectedWard && selectedStatus) {
              handleUpdateTaskStatus(selectedWard, selectedStatus);
            }
            setIsModalEditVisible(false);
          }}
        >
          <h1 className="font-bold text-xl mb-4">Edit Task Status</h1>
          <div className="flex flex-col gap-2">
            <Select value={selectedStatus} onChange={handleStatusTaskChange}>
              <Option value="Not start">Not start</Option>
              <Option value="In progress">In progress</Option>
              <Option value="Done">Done</Option>
            </Select>
          </div>
        </Modal>
      )}

      {/* Task Table */}
      <div className="w-[100%] bg-white rounded-2xl shadow-md p-6">
        <div className="flex flex-row justify-between items-center mb-5">
          <h3 className="text-lg font-bold">Assigned Tasks</h3>
          <div className="flex flex-row justify-between">
            <button
              className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg"
              onClick={() => setIsModalVisible(true)}
            >
              Assign new task
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : tasks.length > 0 ? (
          <Table
            dataSource={tasks.map((task) => ({ ...task, key: task.task_id }))}
            columns={columns}
            rowClassName="cursor-pointer"
            pagination={{ pageSize: 10 }}
            onRow={(record) => ({
              onClick: () => {
                onViewTaskDetails(record);
                setWardId(record.ward_id);
              },
            })}
          />
        ) : (
          <p className="text-gray-500">No tasks assigned.</p>
        )}
        <h3 className="text-base justify-center font-semibold">
          Total Tasks: {tasks.length}
        </h3>
      </div>
      {assignTaskModal}
    </div>
  );
}
