import { useState, useEffect, useRef } from "react";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { useVolcanoContext } from "@/utils/VolcanoContext";
import { Magma } from "@/utils/interfaces";
import { getMagmaData } from "@/utils/utils";
import { DateRange } from "react-day-picker";
import { add } from "date-fns";
import InteractiveLineChart from "@/components/InteractiveLineChart";
import PieCharts from "@/components/PieCharts";
import React from "react";
import MagmaTable from "@/components/MagmaTable";
import { ViewingData } from "@/components/ViewingData";

import { DialogDownload } from "@/components/DialogDownload";
import { downloadFile } from "@/utils/downloadUtils";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";

const chartItems = [
  "silicon",
  "iron",
  "aluminum",
  "calcium",
  "sodium",
  "magnesium",
  "potassium",
];
const colors = [
  "hsl(210, 100%, 50%)", // blue
  "hsl(120, 100%, 50%)", // green
  "hsl(60, 100%, 50%)", // yellow
  "hsl(0, 100%, 50%)", // red
  "hsl(300, 100%, 50%)", // magenta
  "hsl(180, 100%, 50%)", // cyan
  "hsl(30, 100%, 50%)", // orange
];

const chartConfig = chartItems.reduce<{
  [key: string]: { label: string; color: string; unit: string };
}>((config, item, index) => {
  config[item] = {
    label: item.charAt(0).toUpperCase() + item.slice(1),
    color: colors[index % colors.length],
    unit: "%",
  };
  return config;
}, {});

const yAxisDomains = {
  silicon: [0, 100],
  iron: [0, 20],
  aluminum: [0, 25],
  calcium: [0, 20],
  sodium: [0, 10],
  magnesium: [0, 15],
  potassium: [0, 5],
};
const chartLabels = {
  title: "Magma data chart",
  description: "Showing Magma average composition from the volcano",
  cardContent: "Average magma viscosity:",
};

const combineMagmaData = (data: Magma[]): any[] => {
  const combinedData: { [key: number]: any } = {};

  const addData = (array: any[], key: string) => {
    array.forEach((item) => {
      const timestamp = new Date(item.timestamp).getTime();
      if (!combinedData[timestamp]) {
        combinedData[timestamp] = { timestamp };
      }
      combinedData[timestamp][key] = item[key];
    });
  };

  addData(data, "silicon");
  addData(data, "iron");
  addData(data, "aluminum");
  addData(data, "calcium");
  addData(data, "sodium");
  addData(data, "magnesium");
  addData(data, "potassium");

  // console.log("Combined data:", combinedData);

  return Object.values(combinedData);
};

export function Component() {
  const [magmaData, setMagmaData] = useState<Magma[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: add(new Date(), { days: -1 }),
    to: new Date(),
  });
  const { currVolcano } = useVolcanoContext();

  const magmaSocketRef = useRef<WebSocket | null>(null); // Ref to store the WebSocket instance for magma

  useEffect(() => {
    // Cleanup the previous WebSocket connection when volcano changes
    if (magmaSocketRef.current) {
      // console.log("Closing previous magma WebSocket connection");
      magmaSocketRef.current.close();
      magmaSocketRef.current = null;
    }

    const loadData = async () => {
      if (currVolcano) {
        try {
          // Fetch magma data initially (if needed)
          const fromDate = dateRange?.from ?? add(new Date(), { days: -1 });
          const toDate = add(dateRange?.to ?? new Date(), { days: 1 });
          const data: any = await getMagmaData(currVolcano, fromDate, toDate);
          setMagmaData(data.magmaList);
          // console.log("Fetched magma data for:", currVolcano.name);

          // Construct the WebSocket URL for magma
          const uuid = currVolcano.id;
          const magmaWsUrl = `/volcano-updates/${uuid}/magma`; // WebSocket URL for magma data

          // Create a new WebSocket connection for magma
          const magmaSocket = new WebSocket(magmaWsUrl);
          magmaSocketRef.current = magmaSocket;

          // Handle WebSocket messages for magma data
          magmaSocket.onmessage = (event) => {
            try {
              const magmaMessage = JSON.parse(event.data);
              // console.log("Received magma data:", magmaMessage);
              setMagmaData((prevData) => [...prevData, magmaMessage]); // Append new magma data
            } catch (err) {
              console.error("Error parsing magma WebSocket message:", err);
            }
          };

          // WebSocket connection established
          magmaSocket.onopen = () => {
            // console.log("Magma WebSocket connection established:", magmaWsUrl);
          };

          // WebSocket error handler
          magmaSocket.onerror = (err) => {
            console.error("Magma WebSocket error:", err);
          };

          // WebSocket connection closed
          magmaSocket.onclose = () => {
            // console.log("Magma WebSocket connection closed:", magmaWsUrl);
          };
        } catch (error) {
           console.error("Error fetching magma data:", error);
        }
      }
    };

    loadData();

    // Cleanup function to close WebSocket connection when component unmounts or volcano changes
    return () => {
      if (magmaSocketRef.current) {
        // console.log("Closing magma WebSocket connection");
        magmaSocketRef.current.close();
        magmaSocketRef.current = null;
      }
    };
  }, [currVolcano, dateRange]);

  const averageViscosity = React.useMemo(
    () =>
      magmaData.reduce(
        (sum: number, curr: { viscosity: number }) =>
          sum + (curr.viscosity || 0),
        0
      ) / magmaData.length,
    [magmaData]
  );
  chartLabels.cardContent = `Average magma viscosity: ${averageViscosity.toFixed(
    2
  )} Pa.s`;

  const combinedData = combineMagmaData(magmaData);

  const handleDownload = async (data: any) => {
    try {
      const { downloadOption, startDate, endDate } = data;
      let magmaData: Magma[] = [];
      if (!currVolcano) {
        throw new Error("No volcano selected");
      }
      if (downloadOption === "interval_data" && startDate && endDate) {
        // Download data for the specified interval
        magmaData = await getMagmaData(
          currVolcano,
          new Date(startDate),
          add(new Date(endDate), { days: 1 })
        );
      } else {
        // Download all available data
        magmaData = await getMagmaData(currVolcano, new Date(0), new Date());
      }

      const jsonData = JSON.stringify(magmaData, null, 2);
      downloadFile(jsonData, "magma_data.json", "application/json");

      toast({
        variant: "default",
        title: "Download started",
        description: "Your magma data is downloading.",
        action: <ToastAction altText="OK">OK</ToastAction>,
        duration: 5000,
      });
    } catch (error) {
      console.error("Error downloading magma data:", error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: `An error occurred while downloading the data.` + error,
        action: <ToastAction altText="OK">OK</ToastAction>,
        duration: 5000,
      });
    }
  };

  return (
    <main>
      <p className="text-center font-black text-5xl mt-10">Magma</p>
      <DatePickerWithRange
        className="flex justify-center my-12"
        onDateChange={setDateRange}
        initialRange={dateRange}
      />
      <ViewingData dateRange={dateRange} />
      <div className="flex flex-row justify-center gap-10 m-10">
        {magmaData.length > 0 ? (
          <>
            <div className="w-1/6">
              <PieCharts
                chartData={magmaData}
                chartConfig={chartConfig}
                chartItems={chartItems}
                chartDate={dateRange}
              />
            </div>
            <div className="w-5/6">
              <InteractiveLineChart
                chartData={combinedData}
                chartConfig={chartConfig}
                chartItems={chartItems}
                yAxisDomains={yAxisDomains}
                chartLabels={chartLabels}
              />
            </div>
          </>
        ) : (
          <p className="text-center text-2xl text-red-500">
            No data available for this date range
          </p>
        )}
      </div>
      <p className="text-center font-black text-5xl mt-10">
        Magma Indicators Table
      </p>
      <MagmaTable />

      <div className="text-center mb-10">
        <p className="text-center font-black text-3xl mt-10">
          Download Magma Data
        </p>
        <p className="text-center text-lg m-2">
          You can download magma data for a specific interval or all available
          data.
        </p>
        <DialogDownload onDownload={handleDownload} />
      </div>
    </main>
  );
}
