import { useState, useEffect, useRef } from "react";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { useVolcanoContext } from "@/utils/VolcanoContext";
import { Weather } from "@/utils/interfaces";
import { getWeatherData } from "@/utils/utils";
import { DateRange } from "react-day-picker";
import { add } from "date-fns";
import InteractiveLineChart from "@/components/InteractiveLineChart";
import WeatherInfo from "@/components/WeatherInfo";
import { ViewingData } from "@/components/ViewingData";

import sunny from "@/assets/sunny.png";
import cloudy from "@/assets/cloudy.png";
import rainy from "@/assets/raining.png";
import snowy from "@/assets/snowy.png";
import thunder from "@/assets/thunder.png";
import little_clouds from "@/assets/little_clouds.png";

import { DialogDownload } from "@/components/DialogDownload";
import { downloadFile } from "@/utils/downloadUtils";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";

const chartItems = ["pressure", "wind", "temperature", "humidity"];
const colors = [
  "hsl(210, 100%, 50%)", // blue
  "hsl(120, 100%, 50%)", // green
  "hsl(60, 100%, 50%)", // yellow
  "hsl(0, 100%, 50%)", // red
];

const chartConfig = chartItems.reduce<{
  [key: string]: { label: string; color: string; unit: string };
}>((config, item, index) => {
  config[item] = {
    label: item.charAt(0).toUpperCase() + item.slice(1),
    color: colors[index % colors.length],
    unit:
      item === "wind"
        ? "m/s"
        : item === "temperature"
          ? "°C"
          : item === "humidity"
            ? "%"
            : "hPa",
  };
  return config;
}, {});

const yAxisDomains = {
  pressure: [500, 1100],
  wind: [0, 50],
  temperature: [-50, 50],
  humidity: [0, 100],
};

const chartLabels = {
  title: "Weather data chart",
  description: "Showing average weather variables from the volcano",
  cardContent: "",
};

const combineWeatherData = (data: Weather): any[] => {
  const combinedData: { [key: number]: any } = {};
  const keyMapping = {
    pressure: "pressureValue",
    wind: "windSpeed",
    temperature: "temperatureValue",
    humidity: "humidityValue",
  };

  const addData = (array: any[], key: keyof typeof keyMapping) => {
    const actualKey = keyMapping[key] || key;
    array.forEach((item) => {
      //const timestamp = new Date(item.timestamp).getTime();
      const timestamp = new Date(item.timestamp).setSeconds(0, 0);
      if (!combinedData[timestamp]) {
        combinedData[timestamp] = { timestamp };
      }
      combinedData[timestamp][key] = item[actualKey];
    });
  };

  addData(data.pressure, "pressure");
  addData(data.wind, "wind");
  addData(data.temperature, "temperature");
  addData(data.humidity, "humidity");

  // console.log("Combined data:", combinedData);

  return Object.values(combinedData);
};



export function Component() {
  const [weatherData, setWeatherData] = useState<Weather>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: add(new Date(), { days: -1 }),
    to: new Date(),
  });
  const weatherSocketRef = useRef<WebSocket | null>(null);
  const { currVolcano } = useVolcanoContext();

  useEffect(() => {

    if (weatherSocketRef.current) {
      // console.log("Closing previous erosion WebSocket connection");
      weatherSocketRef.current.close();
      weatherSocketRef.current = null;
    }

    const loadData = async () => {
      if (currVolcano) {
        try {
          const fromDate = dateRange?.from ?? new Date(0);
          const toDate = add(dateRange?.to ?? new Date(), { days: 1 });
          const data: any = await getWeatherData(currVolcano, fromDate, toDate);
          setWeatherData(data)

          const uuid = currVolcano.id;
          const weatherWs = `/volcano-updates/${uuid}/weather`;

          const tempSocket = new WebSocket(weatherWs);
          weatherSocketRef.current = tempSocket;

          tempSocket.onmessage = (event) => {
            try {
              const weatherMessage = JSON.parse(event.data);
              // console.log("Received weather data:", weatherMessage);
              // console.log("old Data: ", weatherData)
              if (weatherData) {
                // const newWeather: Weather = {
                //   temperature: [...(weatherData?.temperature || []), weatherMessage.temperature], pressure: [...(weatherData?.pressure || []), weatherMessage.pressure], humidity: [...(weatherData?.humidity || []), weatherMessage.humidity], wind: [...(weatherData?.wind || []), weatherMessage.wind]
                // }
                setWeatherData((prev) => ({
                  ...prev,
                  temperature: [...(prev?.temperature || []), weatherMessage.temperature],
                  pressure: [...(prev?.pressure || []), weatherMessage.pressure],
                  humidity: [...(prev?.humidity || []), weatherMessage.humidity],
                  wind: [...(prev?.wind || []), weatherMessage.wind],
                }));
                // console.log("new data: ", weatherData)
              }
            } catch (err) {
              console.error("Error parsing weather WebSocket message:", err);
            }
          };

          tempSocket.onopen = () => {
            // console.log("weather WebSocket connection established:", weatherWs);
          };

          tempSocket.onerror = (err) => {
            console.error("weather WebSocket error:", err);
          };

          tempSocket.onclose = () => {
            // console.log("weather WebSocket connection closed:", weatherWs);
          };
        } catch (error) {
           console.error("Error fetching weather data:", error);
        }
      }
    };

    loadData();

    return () => {
      if (weatherSocketRef.current) {
        // console.log("Closing eruption WebSocket connection");
        weatherSocketRef.current.close();
        weatherSocketRef.current = null;
      }
    };

  }, [currVolcano, dateRange]);

  const combinedData = weatherData ? combineWeatherData(weatherData) : [];
  const hasData = combinedData.length > 0;
  const mostRecentData = combinedData.find((data) =>
    data.temperature !== undefined &&
    data.humidity !== undefined &&
    data.pressure !== undefined &&
    data.wind !== undefined
  ) || combinedData[0];

  // console.log("Most recent data:", mostRecentData);
  const handleDownload = async (data: any) => {
    try {
      const { downloadOption, startDate, endDate } = data;
      let weatherData: Weather;
      if (!currVolcano) {
        throw new Error("No volcano selected");
      }
      if (downloadOption === "interval_data" && startDate && endDate) {
        // Download data for the specified interval
        weatherData = await getWeatherData(
          currVolcano,
          new Date(startDate),
          add(new Date(endDate), { days: 1 })
        );
      } else {
        // Download all available data
        weatherData = await getWeatherData(currVolcano, new Date(0), new Date());
      }

      const jsonData = JSON.stringify(weatherData, null, 2);
      downloadFile(jsonData, "weather_data.json", "application/json");

      toast({
        variant: "default",
        title: "Download started",
        description: "Your weather data is downloading.",
        action: <ToastAction altText="OK">OK</ToastAction>,
        duration: 5000,
      });
    } catch (error) {
      console.error("Error downloading weather data:", error);
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
      <p className="text-center font-black text-5xl mt-10">Weather Report</p>

      <DatePickerWithRange
        className="flex justify-center my-12"
        onDateChange={setDateRange}
        initialRange={dateRange}
      />

      <ViewingData dateRange={dateRange} />

      {
        mostRecentData && currVolcano && (
          <WeatherInfo
            date={(dateRange?.to ?? new Date()).toDateString()}
            volcanoName={currVolcano.name}
            temperature={mostRecentData.temperature}
            humidity={mostRecentData.humidity}
            pressure={mostRecentData.pressure}
            wind={mostRecentData.wind}
            icon={
              mostRecentData.temperature > 20
                ? sunny
                : mostRecentData.temperature > 10
                  ? little_clouds
                  : mostRecentData.temperature > 0
                    ? cloudy
                    : mostRecentData.temperature > -10
                      ? rainy
                      : mostRecentData.temperature > -20
                        ? snowy
                        : thunder
            }

          />
        )
      }

      {
        hasData ? (
          <div className="flex flex-row justify-center gap-10 m-10">
            <div className="w-5/6">
              <InteractiveLineChart
                chartData={combinedData}
                chartConfig={chartConfig}
                chartItems={chartItems}
                yAxisDomains={yAxisDomains}
                chartLabels={chartLabels}
              />
            </div>
          </div>
        ) : (
          <p className="text-center text-xl m-10 text-red-500">No data available for the selected date range.</p>
        )
      }
      <div className="text-center mb-10">
        <p className="text-center font-black text-3xl mt-10">Download Weather Data</p>
        <p className="text-center text-lg m-2">
          You can download weather data for a specific interval or all available data.
        </p>
        <DialogDownload onDownload={handleDownload} />
      </div>
    </main >
  )
}
