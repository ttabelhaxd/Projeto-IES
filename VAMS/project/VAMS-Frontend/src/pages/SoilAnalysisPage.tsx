import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import DotLineChart from "@/components/DotLineChart.tsx";
import { ViewingData } from "@/components/ViewingData";
import { useVolcanoContext } from "@/utils/VolcanoContext";
import { SoilData } from "@/utils/interfaces";
import { getSoilData } from "@/utils/utils";
import { add } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { DateRange } from "react-day-picker";

import { DialogDownload } from "@/components/DialogDownload";
import { downloadFile } from "@/utils/downloadUtils";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";

const chartConfig = {
  chartSoil: {
    type: {
      label: "Soil type",
      color: "hsl(var(--chart-1))",
    },
    humidity: {
      label: "Humidity",
      color: "hsl(var(--chart-1))",
    },
    landslideProb: {
      label: "Landslide Probability",
      color: "hsl(var(--chart-1))",
    },
    timestamp: {
      label: "Timestamp",
      color: "hsl(var(--chart-1))",
    },
  },
  chartErosion2: {
    erosionValue: {
      label: "Type",
      color: "hsl(var(--chart-2))",
    },
    timestamp: {
      label: "Timestamp",
      color: "hsl(var(--chart-2))",
    },
  },
};

const chartLabels = {
  chartSoil: {
    title: "Landslide likelihood due to soil humidity",
    description: "Landslide likelyhood (%)",
  },
  chartErosion: {
    title: "Erosion Rate on Volcanic Slopes",
    description: "Erosion Rate (cm³/day)",
  },
};

const keys = {
  keysSoil: {
    xkey: "timestamp",
    ykey: "landslideProb",
    stroke: "var(--color-landslideProb)",
    fill: "var(--color-landslideProb)",
  },
  keysErosion: {
    xkey: "timestamp",
    ykey: "erosionValue",
    stroke: "var(--color-erosionValue)",
    fill: "var(--color-erosionValue)",
  },
};

const yAxisConfig = {
  yAxisSoil: {
    min: 0,
    max: 1,
  },
  yAxisErosion: {
    min: 0,
    max: 500,
  },
};



export function Component() {
  const [soilData, setSoilData] = useState<SoilData>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: add(new Date(), { days: -1 }),
    to: new Date(),
  });
  const { currVolcano } = useVolcanoContext();

  const soilSocketRef = useRef<WebSocket | null>(null);
  const erosionSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Cleanup previous WebSocket connections when volcano changes
    if (soilSocketRef.current) {
      // console.log("Closing previous soil WebSocket connection");
      soilSocketRef.current.close();
      soilSocketRef.current = null;
    }
    if (erosionSocketRef.current) {
      // console.log("Closing previous erosion WebSocket connection");
      erosionSocketRef.current.close();
      erosionSocketRef.current = null;
    }

    const loadData = async () => {
      if (currVolcano) {
        try {
          const fromDate = dateRange?.from ?? add(new Date(), { days: -1 });
          const toDate = add(dateRange?.to ?? new Date(), { days: 1 });
          const data: any = await getSoilData(currVolcano, fromDate, toDate);

          setSoilData(data);
          // console.log("Fetched soil data for:", currVolcano.name);

          // Construct WebSocket URLs for soil and erosion
          const uuid = currVolcano.id;
          const soilWsUrl = `/volcano-updates/${uuid}/soil`; // WebSocket URL for soil data
          const erosionWsUrl = `/volcano-updates/${uuid}/erosion`; // WebSocket URL for erosion data

          // Connect to the soil WebSocket
          const soilSocket = new WebSocket(soilWsUrl);
          soilSocketRef.current = soilSocket;

          soilSocket.onmessage = (event) => {
            try {
              const soilMessage = JSON.parse(event.data);
              // console.log("Received soil data:", soilMessage);
              if (soilData) {
                setSoilData((prev) => ({
                  soil: [...(prev?.soil || []), soilMessage],
                  erosion: (prev?.erosion || [])
                }));
              }
            } catch (err) {
              console.error("Error parsing soil WebSocket message:", err);
            }
          };

          soilSocket.onopen = () => {
            // console.log("Soil WebSocket connection established:", soilWsUrl);
          };

          soilSocket.onerror = (err) => {
            console.error("Soil WebSocket error:", err);
          };

          soilSocket.onclose = () => {
            // console.log("Soil WebSocket connection closed:", soilWsUrl);
          };

          // Connect to the erosion WebSocket
          const erosionSocket = new WebSocket(erosionWsUrl);
          erosionSocketRef.current = erosionSocket;

          erosionSocket.onmessage = (event) => {
            try {
              const erosionMessage = JSON.parse(event.data);
              // console.log("Received erosion data:", erosionMessage);
              if (soilData) {
                setSoilData((prev) => ({
                  erosion: [...(prev?.erosion || []), erosionMessage],
                  soil: (prev?.soil || [])
                }));
              }
            } catch (err) {
              console.error("Error parsing erosion WebSocket message:", err);
            }
          };

          erosionSocket.onopen = () => {
            // console.log("Erosion WebSocket connection established:", erosionWsUrl);
          };

          erosionSocket.onerror = (err) => {
            console.error("Erosion WebSocket error:", err);
          };

          erosionSocket.onclose = () => {
            // console.log("Erosion WebSocket connection closed:", erosionWsUrl);
          };

        } catch (error) {
          // console.error("Error fetching soil data:", error);
        }
      }
    };

    loadData();

    // Cleanup function to close WebSocket connections when component unmounts or volcano changes
    return () => {
      if (soilSocketRef.current) {
        // console.log("Closing soil WebSocket connection");
        soilSocketRef.current.close();
        soilSocketRef.current = null;
      }
      if (erosionSocketRef.current) {
        // console.log("Closing erosion WebSocket connection");
        erosionSocketRef.current.close();
        erosionSocketRef.current = null;
      }
    };
  }, [currVolcano, dateRange]);

  const handleDownload = async (data: any) => {
    try {
      const { downloadOption, startDate, endDate } = data;
      let soilData: SoilData;
      if (!currVolcano) {
        throw new Error("No volcano selected");
      }
      if (downloadOption === "interval_data" && startDate && endDate) {
        // Download data for the specified interval
        soilData = await getSoilData(
          currVolcano,
          new Date(startDate),
          add(new Date(endDate), { days: 1 })
        );
      } else {
        // Download all available data
        soilData = await getSoilData(currVolcano, new Date(0), new Date());
      }

      const jsonData = JSON.stringify(soilData, null, 2);
      downloadFile(jsonData, "soil_data.json", "application/json");

      toast({
        variant: "default",
        title: "Download started",
        description: "Your soil data is downloading.",
        action: <ToastAction altText="OK">OK</ToastAction>,
        duration: 5000,
      });
    } catch (error) {
      console.error("Error downloading soil data:", error);
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
      <p className="text-center font-black text-5xl mt-10">Soil Analysis</p>
      <DatePickerWithRange
        className="flex justify-center my-12"
        onDateChange={setDateRange}
        initialRange={dateRange}
      />
      <ViewingData dateRange={dateRange} />
      <div className="flex flex-row justify-center gap-10 m-10">
        <div className="w-1/2">
          {
            soilData?.soil && soilData.soil.length > 0 ? (
              <DotLineChart
                chartData={soilData.soil}
                chartConfig={chartConfig.chartSoil}
                chartLabels={chartLabels.chartSoil}
                keys={keys.keysSoil}
                yAxisConfig={yAxisConfig.yAxisSoil}
              />
            ) : (
              <p className="text-center text-2xl text-red-500">
                No data available for this date range
              </p>
            )
          }
        </div >
        <div className="w-1/2">
          {soilData?.soil && soilData.erosion.length > 0 ? (
            <DotLineChart
              chartData={soilData.erosion}
              chartConfig={chartConfig.chartErosion2}
              chartLabels={chartLabels.chartErosion}
              keys={keys.keysErosion}
              yAxisConfig={yAxisConfig.yAxisErosion}
            />
          ) : (
            <p className="text-center text-2xl text-red-500">
              No data available for this date range
            </p>
          )}
        </div>
      </div >
      <div className="text-center mb-10">
        <p className="text-center font-black text-3xl mt-10">Download Soil Analysis Data</p>
        <p className="text-center text-lg m-2">
          You can download soil analysis data for a specific interval or all available data.
        </p>
        <DialogDownload onDownload={handleDownload} />
      </div>
    </main >
  );
}
