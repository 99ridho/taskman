/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TaskSummary } from "../tasks/types";
import { getTaskSummary } from "./api";
import { useAuth } from "../context";

const SummaryTotalTaskChart = ({
  total,
  completed,
  incomplete,
}: {
  total: number;
  completed: number;
  incomplete: number;
}) => {
  const chartData = [
    {
      field: "incomplete_tasks",
      value: incomplete === 0 ? 0.00001 : incomplete,
      fill: "var(--color-incomplete_tasks)",
    },
    {
      field: "completed_task",
      value: completed === 0 ? 0.00001 : completed,
      fill: "var(--color-completed_task)",
    },
  ];

  const chartConfig = {
    incomplete_tasks: {
      label: "Incomplete",
      color: "var(--color-chart-1)",
    },
    completed_task: {
      label: "Completed",
      color: "var(--color-chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col w-[480px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Tasks Statistics</CardTitle>
        <CardDescription>Completed vs Incompleted Tasks</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="field"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Tasks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const SummaryIncompleteTaskChart = ({
  totalIncomplete,
  overdue,
  due_today,
}: {
  totalIncomplete: number;
  overdue: number;
  due_today: number;
}) => {
  const chartData = [
    {
      field: "overdue",
      value: overdue === 0 ? 0.00001 : overdue,
      fill: "var(--color-overdue)",
    },
    {
      field: "due_today",
      value: due_today === 0 ? 0.00001 : due_today,
      fill: "var(--color-due_today)",
    },
    {
      field: "Other",
      value:
        totalIncomplete === 0
          ? 0.00001
          : totalIncomplete - (overdue + due_today),
      fill: "var(--color-other)",
    },
  ];

  const chartConfig = {
    overdue: {
      label: "Overdue",
      color: "var(--color-chart-1)",
    },
    due_today: {
      label: "Due Today",
      color: "var(--color-chart-4)",
    },
    other: {
      label: "Other",
      color: "var(--color-chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col w-[480px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Incomplete Task Statistics</CardTitle>
        <CardDescription>Overdue and Due Today Tasks</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="field"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalIncomplete.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Tasks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default function HomePage() {
  const [data, setData] = React.useState<TaskSummary>({
    total_tasks: 0,
    completed_tasks: 0,
    incomplete_tasks: 0,
    overdue_tasks: 0,
    due_today_tasks: 0,
  });

  const auth = useAuth();

  const fetchData = async () => {
    const result = await getTaskSummary(auth.token);
    if (result.data) {
      setData(result.data);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex gap-x-4">
      <SummaryTotalTaskChart
        total={data.total_tasks}
        completed={data.completed_tasks}
        incomplete={data.incomplete_tasks}
      />
      <SummaryIncompleteTaskChart
        totalIncomplete={data.incomplete_tasks}
        due_today={data.due_today_tasks}
        overdue={data.overdue_tasks}
      />
    </div>
  );
}
