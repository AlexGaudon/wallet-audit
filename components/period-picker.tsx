"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

export default function PeriodPicker() {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const router = useRouter();

  return (
    <div className="my-auto space-x-2 flex">
      <Select
        value={month.toString()}
        onValueChange={(value) => {
          setMonth(Number(value));
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a month" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Months</SelectLabel>
            <SelectItem value={"0"}>January</SelectItem>
            <SelectItem value={"1"}>February</SelectItem>
            <SelectItem value={"2"}>March</SelectItem>
            <SelectItem value={"3"}>April</SelectItem>
            <SelectItem value={"4"}>May</SelectItem>
            <SelectItem value={"5"}>June</SelectItem>
            <SelectItem value={"6"}>July</SelectItem>
            <SelectItem value={"7"}>August</SelectItem>
            <SelectItem value={"8"}>September</SelectItem>
            <SelectItem value={"9"}>October</SelectItem>
            <SelectItem value={"10"}>November</SelectItem>
            <SelectItem value={"11"}>December</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={year.toString()}
        onValueChange={(value) => {
          setYear(Number(value));
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a year" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Years</SelectLabel>
            <SelectItem value={"2023"}>2023</SelectItem>
            <SelectItem value={"2024"}>2024</SelectItem>
            <SelectItem value={"2025"}>2025</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        onClick={(e) => {
          router.push(
            `${window.location.pathname}?month=${month}&year=${year}`
          );

          router.refresh();
        }}
      >
        Submit
      </Button>
    </div>
  );
}
