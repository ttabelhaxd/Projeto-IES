import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
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

interface InteractiveLineChartProps {
  chartData: any;
  chartConfig: any;
  chartItems: string[];
  yAxisDomains: any;
  chartLabels: any;
}

const InteractiveLineChart: React.FC<InteractiveLineChartProps> = ({
  chartData,
  chartConfig,
  chartItems,
  yAxisDomains,
  chartLabels,
}) => {
  chartConfig = chartConfig satisfies ChartConfig;
  const [activeChart, setActiveChart] = React.useState<
    keyof typeof chartConfig
  >(chartItems[0]);

  const average = React.useMemo(
    () =>
      chartItems.reduce((acc, key) => {
        const total = chartData.reduce(
          (sum: number, curr: { [x: string]: any }) => sum + (curr[key] || 0),
          0
        );
        acc[key] = total / chartData.length;
        return acc;
      }, {} as Record<string, number>),
    [chartData, chartItems]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{chartLabels.title}</CardTitle>
          <CardDescription>{chartLabels.description}</CardDescription>
          <CardContent className="flex gap-2">
            <span className="text-lg">{chartLabels.cardContent}</span>
          </CardContent>
        </div>
        <div className="flex">
          {chartItems.map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={String(chart)}
                data-active={activeChart === chart}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl truncate">
                  {average[key as keyof typeof average].toFixed(2) +
                    chartConfig[chart].unit}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              scale="time"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tickFormatter={(value: any) => value}
              domain={yAxisDomains[activeChart]}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="timestamp"
                  labelFormatter={(value) => {
                    if (typeof value === "number" && !isNaN(value)) {
                      const date = new Date(value);
                      if (!isNaN(date.getTime())) {
                        return date.toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        });
                      }
                    } else if (
                      typeof value === "string" &&
                      value === "timestamp"
                    ) {
                      return "Date";
                    } else if (typeof value === "string") {
                      return value;
                    }
                    return "Invalid Date";
                  }}
                />
              }
            />
            <Line
              dataKey={String(activeChart)}
              type="monotone"
              stroke={`var(--color-${String(activeChart)})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default InteractiveLineChart;
