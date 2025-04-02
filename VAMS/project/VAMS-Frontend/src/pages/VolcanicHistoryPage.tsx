import HistoryTable from "@/components/HistoryTable";
import { Eruption } from "@/utils/interfaces";
import { getEruptionData } from "@/utils/utils";
import { useVolcanoContext } from "@/utils/VolcanoContext";
import { DialogDownload } from "@/components/DialogDownload";
import { useEffect, useState, useRef } from "react";
import { ViewingData } from "@/components/ViewingData";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { DateRange } from "react-day-picker";

import { downloadFile } from "@/utils/downloadUtils";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { add } from "date-fns";


export function Component() {
  const [eruptions, setEruptions] = useState<Eruption[]>([]);
  const { currVolcano } = useVolcanoContext()
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: add(new Date(), { days: -1 }),
    to: new Date(),
  });

  const eruptionSocketRef = useRef<WebSocket | null>(null); // Ref to store the WebSocket instance for eruptions

  useEffect(() => {
    // Cleanup the previous WebSocket connection when volcano changes
    if (eruptionSocketRef.current) {
      // console.log("Closing previous eruption WebSocket connection");
      eruptionSocketRef.current.close();
      eruptionSocketRef.current = null;
    }

    const loadData = async () => {
      if (currVolcano) {
        try {
          const fromDate = dateRange?.from ?? new Date(0);
          const toDate = add(dateRange?.to ?? new Date(), { days: 1 });
          const data: Eruption[] = await getEruptionData(currVolcano, fromDate, toDate);
          setEruptions(data); // Set the fetched eruption data
          // console.log("Fetched eruptions for:", currVolcano.name);

          // Construct the WebSocket URL for eruptions
          const uuid = currVolcano.id;
          const eruptionWsUrl = `/volcano-updates/${uuid}/eruptions`; // WebSocket URL for eruptions data

          // Create a new WebSocket connection for eruptions
          const eruptionSocket = new WebSocket(eruptionWsUrl);
          eruptionSocketRef.current = eruptionSocket;

          // Handle WebSocket messages for eruption data
          eruptionSocket.onmessage = (event) => {
            try {
              const eruptionMessage = JSON.parse(event.data);
              // console.log("Received eruption data:", eruptionMessage);
              setEruptions((prevData) => [...prevData, eruptionMessage]); // Append new eruption data
            } catch (err) {
              console.error("Error parsing eruption WebSocket message:", err);
            }
          };

          // WebSocket connection established
          eruptionSocket.onopen = () => {
            // console.log("Eruption WebSocket connection established:", eruptionWsUrl);
          };

          // WebSocket error handler
          eruptionSocket.onerror = (err) => {
            console.error("Eruption WebSocket error:", err);
          };

          // WebSocket connection closed
          eruptionSocket.onclose = () => {
            // console.log("Eruption WebSocket connection closed:", eruptionWsUrl);
          };

        } catch (error) {
          // console.error("Error fetching eruption data:", error);
        }
      }
    };

    loadData();

    // Cleanup function to close WebSocket connection when component unmounts or volcano changes
    return () => {
      if (eruptionSocketRef.current) {
        // console.log("Closing eruption WebSocket connection");
        eruptionSocketRef.current.close();
        eruptionSocketRef.current = null;
      }
    };

  }, [currVolcano, dateRange]);

  const handleDownload = async (data: any) => {
    try {
      const { downloadOption, startDate, endDate } = data;
      let eruptionData: Eruption[] = [];
      if (!currVolcano) {
        throw new Error("No volcano selected");
      }
      if (downloadOption === "interval_data" && startDate && endDate) {
        // Download data for the specified interval
        eruptionData = await getEruptionData(
          currVolcano,
          new Date(startDate),
          add(new Date(endDate), { days: 1 })
        );
      } else {
        // Download all available data
        eruptionData = await getEruptionData(currVolcano, new Date(0), new Date());
      }

      const jsonData = JSON.stringify(eruptionData, null, 2);
      downloadFile(jsonData, "eruption_data.json", "application/json");

      toast({
        variant: "default",
        title: "Download started",
        description: "Your eruption data is downloading.",
        action: <ToastAction altText="OK">OK</ToastAction>,
        duration: 5000,
      });
    } catch (error) {
      console.error("Error downloading eruption data:", error);
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
      <p className="text-center font-black text-5xl mt-10">Volcanic History</p>
      <div className="text-center my-10 mx-10">
        <h2 className="text-4xl font-extrabold text-gray-900">{currVolcano?.name}</h2>
        <p className="text-lg text-gray-600 mt-4">{currVolcano?.description}</p>
      </div>
      <DatePickerWithRange
        className="flex justify-center my-12"
        onDateChange={setDateRange}
        initialRange={dateRange}
      />
      <ViewingData dateRange={dateRange} />
      <HistoryTable eruptions={eruptions} />
      <div className="text-center mb-10">
        <p className="text-center font-black text-3xl mt-10">Download Volcanic History Data</p>
        <p className="text-center text-lg m-2">
          You can download volcanic history data for a specific interval or all available data.
        </p>
        <DialogDownload onDownload={handleDownload} />
      </div>
    </main >
  );
}
