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
  ChartTooltipContent,
} from "@/components/ui/chart";

interface MultiLineChartProps {
  chartData: any;
  chartConfig: ChartConfig;
  chartLabels: any;
  yAxisConfig: any;
}

const MultiLineChart: React.FC<MultiLineChartProps> = ({
  chartData,
  chartConfig,
  chartLabels,
  yAxisConfig,
}) => {
  chartConfig = chartConfig satisfies ChartConfig;
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
              domain={[yAxisConfig.min, yAxisConfig.max]}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    });
                  }}
                  formatter={(value, name) => {
                    let chemicalNotation = name;
                    let color = "";
                    switch (name) {
                      case "h2S":
                        chemicalNotation = "H₂S";
                        color = "var(--color-H2S)";
                        break;
                      case "co2":
                        chemicalNotation = "CO₂";
                        color = "var(--color-CO2)";
                        break;
                      case "so2":
                        chemicalNotation = "SO₂";
                        color = "var(--color-SO2)";
                        break;
                      case "hcl":
                        chemicalNotation = "HCl";
                        color = "var(--color-HCL)";
                        break;
                      default:
                        break;
                    }
                    return [
                      <span key={`${name}-icon`} style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            backgroundColor: color,
                            marginRight: 5,
                          }}
                        ></span>
                        {chemicalNotation}
                      </span>,
                      <span key={`${name}-value`}>{value + " tons"}</span>,
                    ];
                  }}
                />
              }
            />
            <Line
              dataKey="h2S"
              type="monotone"
              stroke="var(--color-H2S)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="co2"
              type="monotone"
              stroke="var(--color-CO2)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="so2"
              type="monotone"
              stroke="var(--color-SO2)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="hcl"
              type="monotone"
              stroke="var(--color-HCL)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MultiLineChart;
