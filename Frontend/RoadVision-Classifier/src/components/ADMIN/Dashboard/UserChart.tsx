import React, { useEffect, useState } from "react";
import ReactECharts from 'echarts-for-react';
import manageAlluserService from "../../../services/manageAlluser.service";

const UserAndContributionCharts: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [usersCount, setUsersCount] = useState(0);

  const fetchUserData = async () => {
    try {
      const response = await manageAlluserService.getAllUser({});
      setUsers(response.data); // Lưu danh sách người dùng
      setUsersCount(response.data.length); // Tổng số lượng người dùng
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Dữ liệu cho biểu đồ cột
  const barChartOption = {
    title: {
      text: 'Total Users',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    xAxis: {
      type: 'category',
      data: ['Users'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Users Count',
        type: 'bar',
        data: [usersCount],
        itemStyle: {
          color: 'pink',
        },
      },
    ],
  };

  // Dữ liệu cho biểu đồ tròn
  const userPieData = users.map(user => ({
    name: user.fullname || user.username,
    value: user.contribution || 0,
  }));

  const pieChartOption = {
    title: {
      text: 'Contribution',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    series: [
      {
        name: 'Contributions',
        type: 'pie',
        radius: '50%',
        data: userPieData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  return (
    <div className="w-full h-full p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-[#23038C] mb-4">User and Contribution Statistics</h3>
      <div className="flex gap-4">
        {/* Biểu đồ cột */}
        <div className="w-1/3">
          <ReactECharts option={barChartOption} style={{ height: "450px", width: "100%" }} />
        </div>

        {/* Biểu đồ tròn */}
        <div className="w-2/3">
          <ReactECharts option={pieChartOption} style={{ height: "450px", width: "100%" }} />
        </div>
      </div>
    </div>
  );
};

export default UserAndContributionCharts;
