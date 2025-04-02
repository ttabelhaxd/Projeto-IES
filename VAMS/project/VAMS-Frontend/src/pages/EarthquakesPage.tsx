import EarthquakesTable from "@/components/EarthquakesTable";
import Map from "@/components/Map";
import { Earthquake } from "@/utils/interfaces";
import { useState, useEffect, useRef } from "react";
import { useVolcanoContext } from "@/utils/VolcanoContext";
import { getEarthquakeData } from "@/utils/utils";

import { add, addDays } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { DialogDownload } from "@/components/DialogDownload";
import { downloadFile } from "@/utils/downloadUtils";



export function Component() {
  const [earthquakesData, setEarthquakes] = useState<Earthquake[]>([]);
  const { currVolcano } = useVolcanoContext();
  const [startDate, setStartDate] = useState<Date>(addDays(new Date(), -1));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const socketRef = useRef<WebSocket | null>(null);

  const loadData = async (start: Date, end: Date) => {
    if (currVolcano) {
      try {
        const data: Earthquake[] = await getEarthquakeData(currVolcano, start, end);
        if (data.length === 0) {
          setHasMoreData(false);
        } else {
          setEarthquakes(prevData => {
            const newData = data.filter(
              earthquake => !prevData.some(e => e.timestamp === earthquake.timestamp)
            );
            return [...prevData, ...newData];
          });
        }
        // console.log("Fetched earthquakes for:", currVolcano.name);



      } catch (error) {
        console.error("Error fetching earthquake data:", error);
      }
    }
  };

  useEffect(() => {
    // Cleanup the previous WebSocket connection when `currVolcano` changes
    if (socketRef.current) {
      // console.log("Closing previous WebSocket connection");
      socketRef.current.close();
      socketRef.current = null; // Clear the ref
    }

    if (currVolcano) {
      const uuid = currVolcano.id;
      const topic = "earthquake";
      const wsUrl = `/volcano-updates/${uuid}/${topic}`; // WebSocket URL

      // Create new WebSocket connection for the new volcano
      const socket = new WebSocket(wsUrl);

      // Store the new WebSocket connection in the ref
      socketRef.current = socket;

      // WebSocket message handler
      socket.onmessage = (event) => {
        try {
          const newEarthquake: Earthquake = JSON.parse(event.data);
          // console.log("New earthquake received:", newEarthquake);
          setEarthquakes((prev) => [...prev, newEarthquake]); // Append new earthquake data
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      // WebSocket open handler
      socket.onopen = () => {
        // console.log("WebSocket connection established:", wsUrl);
      };

      // WebSocket error handler
      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
      };

      // WebSocket close handler
      socket.onclose = () => {
        // console.log("WebSocket connection closed:", wsUrl);
      };
    }

    setEarthquakes([]);
    setHasMoreData(true);
    loadData(startDate, endDate);

    return () => {
      if (socketRef.current) {
        // console.log("Closing WebSocket connection");
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [currVolcano]);


  useEffect(() => {
    loadData(startDate, endDate);
    if (!hasMoreData) {
      toast({
        variant: "default",
        title: "No more data",
        description: "You have reached the end of the eartquake data",
        action: <ToastAction altText="OK">OK</ToastAction>,
        duration: 5000,
      });
    }
  }, [startDate, endDate, hasMoreData]);

  const loadMoreData = () => {
    const newStartDate = addDays(startDate, -5);
    setStartDate(newStartDate);
    const newEndDate = addDays(endDate, -5);
    setEndDate(newEndDate);
  };


  const handleDownload = async (data: any) => {
    try {
      const { downloadOption, startDate, endDate } = data;
      let earthquakeData: Earthquake[] = [];
      if (!currVolcano) {
        throw new Error("No volcano selected");
      }
      if (downloadOption === "interval_data" && startDate && endDate) {
        // Download data for the specified interval
        earthquakeData = await getEarthquakeData(
          currVolcano,
          new Date(startDate),
          add(new Date(endDate), { days: 1 })
        );
      } else {
        // Download all available data
        earthquakeData = await getEarthquakeData(currVolcano, new Date(0), new Date());
      }

      const jsonData = JSON.stringify(earthquakeData, null, 2);
      downloadFile(jsonData, "earthquake_data.json", "application/json");

      toast({
        variant: "default",
        title: "Download started",
        description: "Your earthquake data is downloading.",
        action: <ToastAction altText="OK">OK</ToastAction>,
        duration: 5000,
      });
    } catch (error) {
      console.error("Error downloading earthquake data:", error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "An error occurred while downloading the data. " + error,
        action: <ToastAction altText="OK">OK</ToastAction>,
        duration: 5000,
      });
    }
  };

  return (
    <main>
      <p className="text-center font-black text-5xl mt-10">
        Earthquake viewer
      </p>
      <Map earthquakes={earthquakesData} currVolcano={currVolcano} />
      <EarthquakesTable earthquakes={earthquakesData} />
      <div className="text-center mb-10">
        <button
          onClick={loadMoreData}
          className={`px-4 py-2 rounded ${hasMoreData ? 'bg-blue-500 text-white' : 'bg-gray-500 text-gray-300'}`}
          disabled={!hasMoreData}
          title="Load 5 more days"
        >
          Load More
        </button>
      </div>
      <div className="text-center mb-10">
        <p className="text-center font-black text-3xl mt-10">Download Earthquake Data</p>
        <p className="text-center text-lg m-2">
          You can download earthquake data for a specific interval or all available data.
        </p>
        <DialogDownload onDownload={handleDownload} />
      </div>
    </main>
  );
}
