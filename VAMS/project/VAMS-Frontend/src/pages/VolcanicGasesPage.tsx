import { useState, useEffect, useRef } from "react";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { useVolcanoContext } from "@/utils/VolcanoContext";
import { Gas } from "@/utils/interfaces";
import { getGasesData } from "@/utils/utils";
import { add } from "date-fns";
import { DateRange } from "react-day-picker";
import MultiLineChart from "@/components/MultiLineChart";
import { SelectGases } from "@/components/SelectGases";
import GasIndicatorTable from "@/components/GasIndicatorTable";
import { ViewingData } from "@/components/ViewingData";

import { DialogDownload } from "@/components/DialogDownload";
import { downloadFile } from "@/utils/downloadUtils";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";

const chartConfig = {
  H2S: {
    label: "H₂S",
    color: "hsl(var(--chart-1))",
  },
  CO2: {
    label: "CO₂",
    color: "hsl(var(--chart-2))",
  },
  SO2: {
    label: "SO₂",
    color: "hsl(var(--chart-3))",
  },
  HCL: {
    label: "HCl",
    color: "hsl(var(--chart-4))",
  },
};

const chartLabels = {
  title: "Gases Emission",
  description: "Gases Emission (tons)",
};

const yAxisConfig = {
  min: 0,
  max: 100,
};

export function Component() {
  const [gasesData, setGasesData] = useState<Gas[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: add(new Date(), { days: -1 }),
    to: new Date(),
  });
  const { currVolcano } = useVolcanoContext();
  const [selectedGases, setSelectedGases] = useState<string[]>([
    "SO2",
    "CO2",
    "H2S",
    "HCl",
  ]);

  const gasesSocketRef = useRef<WebSocket | null>(null); // Ref to store the WebSocket instance for gases

  useEffect(() => {
    // Cleanup the previous WebSocket connection when volcano changes
    if (gasesSocketRef.current) {
      // console.log("Closing previous gases WebSocket connection");
      gasesSocketRef.current.close();
      gasesSocketRef.current = null;
    }

    const loadData = async () => {
      if (currVolcano) {
        try {
          // Fetch gases data initially (if needed)

          const fromDate = dateRange?.from ?? new Date(0);
          const toDate = add(dateRange?.to ?? new Date(), { days: 1 });
          const data: any = await getGasesData(
            currVolcano,
            selectedGases,
            fromDate,
            toDate
          );
          setGasesData(data.entries)
          // console.log("Fetched gases data for:", currVolcano.name);

          // Construct the WebSocket URL for gases
          const uuid = currVolcano.id;
          const gasesWsUrl = `/volcano-updates/${uuid}/gases`; // WebSocket URL for gases data

          // Create a new WebSocket connection for gases
          const gasesSocket = new WebSocket(gasesWsUrl);
          gasesSocketRef.current = gasesSocket;

          // Handle WebSocket messages for gases data
          gasesSocket.onmessage = (event) => {
            try {
              const gasesMessage = JSON.parse(event.data);
              // console.log("Received gases data:", gasesMessage);
              setGasesData((prevData) => [...prevData, gasesMessage]); // Append new gases data to the existing data
            } catch (err) {
              console.error("Error parsing gases WebSocket message:", err);
            }
          };

          // WebSocket connection established
          gasesSocket.onopen = () => {
            // console.log("Gases WebSocket connection established:", gasesWsUrl);
          };

          // WebSocket error handler
          gasesSocket.onerror = (err) => {
            console.error("Gases WebSocket error:", err);
          };

          // WebSocket connection closed
          gasesSocket.onclose = () => {
            // console.log("Gases WebSocket connection closed:", gasesWsUrl);
          };

        } catch (error) {
          console.error("Error fetching gases data:", error);
        }
      }
    };

    loadData();
    return () => {
      if (gasesSocketRef.current) {
        // console.log("Closing gases WebSocket connection");
        gasesSocketRef.current.close();
        gasesSocketRef.current = null;
      }
    };
  }, [currVolcano, selectedGases, dateRange]);
  const handleDownload = async (data: any) => {
    try {
      const { downloadOption, startDate, endDate } = data;
      let gasesData: Gas[] = [];
      if (!currVolcano) {
        throw new Error("No volcano selected");
      }
      if (downloadOption === "interval_data" && startDate && endDate) {
        // Download data for the specified interval
        gasesData = await getGasesData(
          currVolcano,
          selectedGases,
          new Date(startDate),
          add(new Date(endDate), { days: 1 })
        );
      } else {
        // Download all available data
        gasesData = await getGasesData(currVolcano, selectedGases, new Date(0), new Date());
      }

      const jsonData = JSON.stringify(gasesData, null, 2);
      downloadFile(jsonData, "gases_data.json", "application/json");

      toast({
        variant: "default",
        title: "Download started",
        description: "Your gases data is downloading.",
        action: <ToastAction altText="OK">OK</ToastAction>,
        duration: 5000,
      });
    } catch (error) {
      console.error("Error downloading gases data:", error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "An error occurred while downloading the data." + error,
        action: <ToastAction altText="OK">OK</ToastAction>,
        duration: 5000,
      });
    }
  };

  return (
    <main>
      <p className="text-center font-black text-5xl mt-10">Volcanic Gases</p>
      <div className="flex flex-row justify-center my-12 gap-4">
        <DatePickerWithRange
          className="mt-2"
          onDateChange={setDateRange}
          initialRange={dateRange}
        />
        <SelectGases
          selectedGases={selectedGases}
          setSelectedGases={setSelectedGases}
        />
      </div>
      <ViewingData dateRange={dateRange} />
      <div className="flex flex-row justify-center gap-10 m-10">
        <div className="w-7/12">
          {gasesData.length > 0 ? (
            <MultiLineChart
              chartData={gasesData}
              chartConfig={chartConfig}
              chartLabels={chartLabels}
              yAxisConfig={yAxisConfig}
            />
          ) : (
            <p className="text-center text-2xl text-red-500">
              No data available for this date range
            </p>
          )}
        </div>
      </div>
      <p className="text-center font-black text-3xl mt-10">
        Gas Indicator Table
      </p>
      <GasIndicatorTable />
      <div className="text-center mb-10">
        <p className="text-center font-black text-3xl mt-10">Download Volcanic Gases Data</p>
        <p className="text-center text-lg m-2">
          You can download volcanic gases data for a specific interval or all available data.
        </p>
        <DialogDownload onDownload={handleDownload} />
      </div>
    </main>
  );
}
