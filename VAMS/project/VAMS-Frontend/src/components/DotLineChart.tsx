"use client";

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
} from "@/components/ui/chart";

interface DotLineChartProps {
  chartData: any;
  chartConfig?: any;
  chartLabels?: any;
  keys?: any;
  yAxisConfig?: any;
}

const DotLineChart: React.FC<DotLineChartProps> = ({
  chartData,
  chartConfig,
  chartLabels,
  keys,
  yAxisConfig,
}) => {
  chartConfig = chartConfig satisfies ChartConfig;

  const validChartData = chartData
    .map((data: any) => ({
      ...data,
      [keys.xkey]: new Date(data[keys.xkey]).getTime(),
    }))
    .filter((data: any) => !isNaN(data[keys.xkey]));

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: any[];
    label?: any;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="text-sm font-bold">
            {new Date(label).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </p>

          {payload[0]?.payload && (
            <div className="mt-2">
              {payload[0].payload.humidity !== undefined && (
                <p className="text-sm">
                  <strong>Humidity:</strong> {payload[0].payload.humidity.toFixed(1) + "%"}
                </p>
              )}
              {payload[0].payload.landslideProb !== undefined && (
                <p className="text-sm">
                  <span
                    style={{
                      display: "inline-block",
                      width: 10,
                      height: 10,
                      backgroundColor: "hsl(var(--chart-1))",
                      marginRight: 5,
                    }}
                  ></span>
                  <strong>Landslide Probability:</strong> {(payload[0].payload.landslideProb * 100).toFixed(1) + "%"}
                </p>
              )}
              {payload[0].payload.type !== undefined && (
                <p className="text-sm">
                  <strong>Type:</strong> {payload[0].payload.type}
                </p>
              )}
            </div>
          )}

          {payload[0]?.payload && (
            <div className="mt-2">
              {payload[0].payload.erosionValue !== undefined && (
                <p className="text-sm">
                  <span
                    style={{
                      display: "inline-block",
                      width: 10,
                      height: 10,
                      backgroundColor: "hsl(var(--chart-2))",
                      marginRight: 5,
                    }}
                  ></span>
                  <strong>Erosion Rate:</strong> {payload[0].payload.erosionValue.toFixed(1) + " cm³/day"}
                </p>

              )}

            </div>
          )}
        </div>
      );
    }

    return null;
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{chartLabels.title}</CardTitle>
        <CardDescription>{chartLabels.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={validChartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={keys.xkey}
              tickLine={false}
              axisLine={false}
              tickMargin={12}
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
            <ChartTooltip cursor={false} content={<CustomTooltip />} />
            <Line
              dataKey={keys.ykey}
              type="bumpX"
              stroke={keys.stroke}
              strokeWidth={2}
              dot={{
                fill: keys.fill,
                r: 1.5,
              }}
              activeDot={{
                r: 6,
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tickFormatter={(value) => value}
              domain={[yAxisConfig.min, yAxisConfig.max]}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DotLineChart;
