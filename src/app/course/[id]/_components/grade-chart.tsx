"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { TRPCError } from "@trpc/server";
import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import QueryBoundary from "~/components/query-boundary";
import { Button } from "~/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { Checkbox } from "~/components/ui/checkbox";
import { Slider } from "~/components/ui/slider";
import { selectedSemesterAtom } from "~/stores/course";
import { useTRPC } from "~/trpc/client";

function GradeChart() {
  const { id } = useParams<{ id: string }>();

  const api = useTRPC();
  const { data: course } = useSuspenseQuery(
    api.course.getCourse.queryOptions({ id }),
  );

  const [selectedSemester, setSelectedSemester] = useAtom(selectedSemesterAtom);
  const [showGenders, setShowGenders] = useState(false);

  useEffect(
    () => setSelectedSemester(course.semesters.length - 1),
    [setSelectedSemester, course.semesters.length],
  );

  const chartData = useMemo(
    () =>
      course.semesters[selectedSemester]?.grades.map((grade) => ({
        grade: grade.grade,
        bar1: showGenders ? grade.menCount : grade.menCount + grade.womenCount,
        bar2: grade.womenCount,
      })),
    [course.semesters, selectedSemester, showGenders],
  );

  const chartConfig = {
    bar1: {
      label: showGenders ? "Men" : "Total",
      color: "hsl(var(--chart-primary))",
    },
    bar2: {
      label: "Women",
      color: "hsl(var(--chart-secondary))",
    },
  };

  return (
    <div className="h-96 w-80">
      <ChartContainer config={chartConfig} className="h-[400] w-[500]">
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 30,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="grade"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Bar
            dataKey="bar1"
            fill="hsl(var(--chart-primary))"
            radius={4}
            isAnimationActive
          >
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
          {showGenders && (
            <Bar
              dataKey="bar2"
              fill="hsl(var(--chart-secondary))"
              radius={4}
              isAnimationActive
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          )}
        </BarChart>
      </ChartContainer>
      <div className="flex items-center justify-start space-x-2">
        <Checkbox
          id="genders"
          checked={showGenders}
          onCheckedChange={() => setShowGenders(!showGenders)}
        />
        <label htmlFor="genders">Show genders</label>
      </div>
      <div>
        <Slider
          min={0}
          max={course.semesters.length - 1}
          step={1}
          value={[selectedSemester]}
          onValueChange={(value) => setSelectedSemester(value[0] ?? 0)}
        />
      </div>
      <pre>
        <code>{JSON.stringify(course, null, 2)}</code>
      </pre>
    </div>
  );
}

export default function GradeChartContainer() {
  return (
    <QueryBoundary
      fallback={({ error, resetErrorBoundary }) => {
        console.log(error);
        if (error instanceof TRPCError) {
          return <div>{error.message}</div>;
        }

        return (
          <div className="flex flex-col">
            An error occured.
            <Button onClick={() => resetErrorBoundary()}>reset</Button>
          </div>
        );
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <GradeChart />
      </Suspense>
    </QueryBoundary>
  );
}
