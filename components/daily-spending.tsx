"use client";
import { type Category } from "@/lib/definitions";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PeriodPicker from "./period-picker";

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

  const dimensions = {
    width: 0,
    height: 0,
  };

  if (typeof window !== "undefined") {
    dimensions.width = window?.screen.width ?? 0;
    dimensions.height = window?.screen.height * 0.9 ?? 0;
  }

  return (
    <div className="grid grid-cols-1 w-full">
      <PeriodPicker />

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          {...dimensions}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <Tooltip coordinate={{ x: 0, y: 0 }} />
          <CartesianGrid strokeDasharray="3" />
          <XAxis dataKey="name" />
          <YAxis />
          {bars}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
