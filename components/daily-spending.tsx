"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function DailySpending({ realData }: { realData: any }) {
  const [data, setData] = useState<any>([]);
  const [colors, setColors] = useState<{
    [T: string]: string;
  }>({});

  const [bars, setBars] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    setData(realData);
    const colorsForCategories = [];
    for (let data of realData) {
      let keys = Object.keys(data);
      for (let key of keys) {
        if (key === "Income") continue;
        if (colors?.[key] === undefined) {
          console.log(keys);
          colors[key] = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
          if (key !== "name") {
            bars.push(<Bar dataKey={key} stackId="a" fill={colors[key]} />);
          }
        }
      }
    }
  }, [data, colors, bars]);

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={window.screen.width}
          height={window.screen.height * 0.9}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <Tooltip coordinate={{ x: 0, y: 0 }} />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Legend />
          {bars}
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
