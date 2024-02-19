"use client";
import { type Category } from "@/lib/definitions";
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

export function DailySpending({
  realData,
  categories,
}: {
  realData: {
    [T: string]: string;
    name: string;
  }[];
  categories: Category[];
}) {
  const [data, setData] = useState<
    {
      [T: string]: string;
      name: string;
    }[]
  >([]);
  const [colors, setColors] = useState<{
    [T: string]: string;
  }>({});

  const [bars, setBars] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    setData(realData);
    for (let data of realData) {
      let keys = Object.keys(data);
      for (let key of keys) {
        if (colors?.[key] === undefined) {
          const category = categories.find((category) => category.name === key);
          if (category === undefined) continue;
          colors[key] = category?.color;
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
          width={window?.screen.width ?? 0}
          height={window?.screen.height * 0.9 ?? 0}
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
