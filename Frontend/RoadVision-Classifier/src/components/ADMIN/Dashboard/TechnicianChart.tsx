import React, { useEffect, useState } from "react";
import ReactECharts from 'echarts-for-react';
import manageAlltechnicianService from "../../../services/manageAlltechnician.service";

const TechnicianTaskChart: React.FC = () => {
  const [technicians, setTechnicians] = useState<any[]>([]);

  const fetchTechnicianData = async () => {
    try {
      const response = await manageAlltechnicianService.getAllTechnician({});
      setTechnicians(response.data); // Lưu danh sách kỹ thuật viên
    } catch (error) {
      console.error("Error fetching technicians:", error);
    }
  };

  useEffect(() => {
    fetchTechnicianData();
  }, []);

  // Dữ liệu cho biểu đồ cột ghép
  const technicianNames = technicians.map(
    (tech) => tech.username
  );

  const taskDoneData = technicians.map((tech) => tech.task_done || 0);
  const totalTaskData = technicians.map((tech) => tech.all_task || 0);

  const chartOption = {
    title: {
      text: 'Technician Task Overview',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['Task Done', 'Total Tasks'],
      bottom: '0%',
    },
    xAxis: {
      type: 'category',
      data: technicianNames,
      axisLabel: {
        rotate: 30,
        interval: 0,
      },
    },
    yAxis: {
      type: 'value',
      name: 'Tasks',
    },
    series: [
      {
        name: 'Task Done',
        type: 'bar',
        data: taskDoneData,
        itemStyle: {
          color: 'green', // Màu xanh lá cho Task Done
        },
      },
      {
        name: 'Total Tasks',
        type: 'bar',
        data: totalTaskData,
        itemStyle: {
          color: 'red', // Màu xanh dương cho Total Tasks
        },
      },
    ],
  };

  return (
    <div className="w-full h-full p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-[#23038C] mb-4">Technician Task Statistics</h3>
      <ReactECharts option={chartOption} style={{ height: "450px", width: "100%" }} />
    </div>
  );
};

export default TechnicianTaskChart;
