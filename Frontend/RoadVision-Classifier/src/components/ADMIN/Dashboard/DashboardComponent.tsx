import React, { useEffect, useState } from "react";
import ReactECharts from 'echarts-for-react'; // Import ECharts React
import { Select, InputNumber } from "antd";
import manageStatisticInfoService from "../../../services/manageStatisticInfo.service";

interface ChartData {
  category: string;
  type: string;
  value: number;
}

const processData = (apiData: any) => {
  const total = apiData?.Total.reduce((acc: any, item: string) => {
    const [key, value] = item.replace(/['"]/g, "").split(": ");
    acc[key.trim()] = parseInt(value, 10);
    return acc;
  }, {});

  const done = apiData?.Done.reduce((acc: any, item: string) => {
    const [key, value] = item.replace(/['"]/g, "").split(": ");
    acc[key.trim()] = parseInt(value, 10);
    return acc;
  }, {});

  const categories = Object.keys(total || {});

  return categories.flatMap((category) => [
    { category, type: "Total", value: total[category] || 0 },
    { category, type: "Done", value: done[category] || 0 },
  ]);
};

const DashboardComponent: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [, setLoading] = useState(false);
  const [during, setDuring] = useState<"monthly" | "yearly">("monthly");
  const [number, setNumber] = useState<number>(3);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await manageStatisticInfoService.getStatistic({ during, number });
      const formattedData = processData(response);
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [during, number]);

  // Chuyển đổi dữ liệu thành dạng phù hợp cho ECharts
  const chartData = () => {
    const total = data.filter(d => d.type === "Total");
    const done = data.filter(d => d.type === "Done");

    return {
      categories: Array.from(new Set(data.map(d => d.category))),
      total,
      done
    };
  };

  // ECharts option
  const option = {
    legend: {},
    tooltip: {},
    dataset: {
      dimensions: ['type', 'total', 'done'],
      source: chartData().categories.map((category) => ({
        type: category,
        total: chartData().total.find(d => d.category === category)?.value || 0,
        done: chartData().done.find(d => d.category === category)?.value || 0,
      }))
    },
    xAxis: { type: 'category' },
    yAxis: {},
    series: [
      {
        name: 'Total',
        type: 'bar',
        color: "#5B7AD7"
      },
      {
        name: 'Done',
        type: 'bar',
        color: "#91CC75" 
      }
    ]
  };

  return (
    <div className="w-full h-full p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-[#23038C] mb-4">Road Status Overview</h3>
      <div className="mb-4 flex gap-4 items-center">
        <Select
          value={during}
          onChange={(value: "monthly" | "yearly") => setDuring(value)}
          options={[
            { value: "monthly", label: "Monthly" },
            { value: "yearly", label: "Yearly" },
          ]}
          className="w-40"
        />
        <InputNumber
          value={number}
          onChange={(value) => setNumber(value || 1)}
          min={1}
          className="w-20"
        />
        <button onClick={fetchStatistics} className="bg-white border-2 border-[#23038C] text-[#23038C] font-base px-4 py-1 rounded-lg" >
          Refresh
        </button>
      </div>

      {/* Biểu đồ của ECharts */}
      <ReactECharts option={option} style={{ height: "400px", width: "50%" }} />
    </div>
  );
};

export default DashboardComponent;
