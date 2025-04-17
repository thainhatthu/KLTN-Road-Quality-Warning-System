import { Table, Tag, Input, Spin } from "antd";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import dataService from "../../services/data.service";
import { accountState } from "../../atoms/authState";
const api_url = "https://exotic-strong-viper.ngrok-free.app";

interface DataType {
  time: string;
  image: string;
  level: string;
  road_id: string;
  address: string;
  location: JSX.Element;
}

export default function History() {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [filteredData, setFilteredData] = useState<DataType[]>([]); // Dữ liệu đã lọc
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState(""); // Text tìm kiếm
  const userRecoilStateValue = useRecoilValue(accountState);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await dataService.getInfoRoads({
          user_id: userRecoilStateValue.id,
          all: true,
        });

        if (Array.isArray(data)) {
          const roads = data.map((item: string) => {
            const parsedItem = JSON.parse(item);
            return {
              time: parsedItem.created_at,
              image: parsedItem.filepath,
              level: parsedItem.level || "N/A",
              address: parsedItem.location || "Unknown",
              road_id: parsedItem.road_id,
              location: (
                <span>
                  Lat: {parsedItem.latitude}
                  <br />
                  Long: {parsedItem.longitude}
                </span>
              ),
            };
          });

          setDataSource(roads);
          setFilteredData(roads); // Đặt filteredData ban đầu bằng dataSource
        } else {
          console.error("Dữ liệu không phải mảng:", data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đường:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userRecoilStateValue.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Very poor":
        return "red";
      case "Poor":
        return "yellow";
      case "Satisfactory":
        return "blue";
      case "Good":
        return "green";
      default:
        return "default";
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = dataSource.filter(item =>
      item.address.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const columns = [
    {
      title: "Time Uploaded",
      dataIndex: "time",
      key: "time",
      align: "center" as "center",
      sorter: (a: DataType, b: DataType) => new Date(a.time).getTime() - new Date(b.time).getTime(),
      render: (time: string) => {
        const date = new Date(time);
        const formattedTime = new Intl.DateTimeFormat("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(date);
        return <span>{formattedTime}</span>;
      },
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      align: "center" as "center",
      render: (image: string) => {
        const fullImageUrl = `${api_url}/${image}`;
        return (
          <img
            src={fullImageUrl}
            alt="Road"
            style={{
              width: 100,
              height: 60,
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        );
      },
    },
    {
      title: "Status",
      dataIndex: "level",
      key: "level",
      align: "center" as "center",
      sorter: (a: DataType, b: DataType) => {
        const levels = ["Very poor", "Poor", "Satisfactory", "Good"];
        return levels.indexOf(a.level) - levels.indexOf(b.level);
      },
      render: (level: string) => (
        <Tag color={getStatusColor(level)}>{level}</Tag>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address: string) => <span>{address}</span>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
  ];

  return (
    <div className="w-[95%] bg-white p-5 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Upload history</h2>
      <Input
        placeholder="Search by Address"
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        style={{
          marginBottom: 16,
          borderRadius: "8px",
          padding: "8px 16px",
          fontSize: "16px",
        }}
      />
      {loading ? (
        <div className="flex justify-center items-center" style={{ height: "200px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={filteredData}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 5 }}
          rowKey="road_id"
          style={{
            borderRadius: "12px",
            border: "1px solid #f0f0f0",
          }}
          rowClassName="table-row"
        />
      )}
    </div>
  );
}
