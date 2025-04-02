"use client"

import { Pie, PieChart, Cell, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import React from "react"

interface InteractiveLineChartProps {
  chartData: any
  chartConfig: any
  chartItems: string[]
  chartDate: any
}

const PieCharts: React.FC<InteractiveLineChartProps> = ({ chartData, chartConfig, chartItems, chartDate }) => {
  const config = chartConfig satisfies ChartConfig;

  const average = React.useMemo(
    () => chartItems.reduce((acc, key) => {
      const total = chartData.reduce((sum: number, curr: { [x: string]: any }) => sum + (curr[key] || 0), 0)
      acc[key] = total / chartData.length
      return acc
    }, {} as Record<string, number>),
    [chartData, chartItems]
  )
  
  const averageData = chartItems.map(item => ({
    name: item,
    value: average[item],
    color: config[item].color
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Average Composition</CardTitle>
        <CardDescription>
          {chartDate?.from && chartDate?.to
            ? `${new Date(chartDate.from).toDateString()} - ${new Date(chartDate.to).toDateString()}`
            : chartDate?.from
            ? `${new Date(chartDate.from).toDateString()} - ${new Date().toDateString()}`
            : "Last 24 Hours"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie data={averageData} dataKey="value" nameKey="name">
              {averageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          <Tooltip
            content={({ payload }: { payload?: Array<{ name?: string; value?: number }> }) => {
              if (payload && payload.length) {
                const { name, value } = payload[0];
                return (
                  <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded">
                    <p className="label">{`${name} : ${value?.toFixed(1)}%`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default PieCharts;