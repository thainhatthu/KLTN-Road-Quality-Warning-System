import { Breadcrumb, Input, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { wardIdState } from "../../../atoms/technicianTask/tasksState";
import technicianService from "../../../services/technicianprofile.service";
const api_url = import.meta.env.VITE_BASE_URL;

interface AllTaskDetailProps {
  task: any;
  technician: any;
  onBackToTechnicianInfo: () => void;
  onBackToAllTechnicians: () => void;
}

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
  const [filteredDataSource, setFilteredDataSource] = useState<any[]>([]);

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
  ];
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
        <div className="w-full px-20 mb-10">
          <Input
            placeholder="Search by Road Name"
            value={searchQuery}
            onChange={handleSearch}
            style={{ width: "100%", margin: "10px 0" }}
          />
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
