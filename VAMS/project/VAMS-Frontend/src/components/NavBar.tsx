import { Link } from "react-router-dom";
import logo from "../assets/vams_logo.svg";
import { SelectVolcano } from "./SelectVolcano";
import { DialogEditVolcano } from "./DialogEditVolcano";
import { downloadFile } from "@/utils/downloadUtils";
import { useVolcanoContext } from "@/utils/VolcanoContext";
import { getEarthquakeData, getMagmaData, getEruptionData, getGasesData, getSoilData, getWeatherData } from "@/utils/utils";
import { Volcano } from "@/utils/interfaces";
import { AlertDownload } from "@/components/AlertDownload";

interface Route {
  name: string;
  path: string;
}

const routes: Route[] = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Earthquakes",
    path: "/earthquakes",
  },
  {
    name: "Magma",
    path: "/magma",
  },
  {
    name: "Soil Analysis",
    path: "/soil-analysis",
  },
  {
    name: "Weather",
    path: "/weather",
  },
  {
    name: "Volcanic Gases",
    path: "/volcanic-gases",
  },
  {
    name: "Volcanic History",
    path: "/volcanic-history",
  },
  {
    name: "About Us",
    path: "/aboutus",
  },
];

const handleDownload = async (currVolcano: Volcano) => {
  if (!currVolcano) {
    console.error("No volcano selected");
    return;
  }

  try {
    // Set date range or use default
    const startDate = new Date(0);  // Start date (adjust as needed)
    const endDate = new Date();     // End date (current date)

    // Fetch all relevant data
    const gasesData = await getGasesData(currVolcano, ["SO2", "CO2", "H2S", "HCl"], startDate, endDate);
    const earthquakeData = await getEarthquakeData(currVolcano, startDate, endDate);
    const eruptionData = await getEruptionData(currVolcano, startDate, endDate);
    const weatherData = await getWeatherData(currVolcano, startDate, endDate);
    const soilData = await getSoilData(currVolcano, startDate, endDate);
    const magmaData = await getMagmaData(currVolcano, startDate, endDate);

    // Combine all the data into a single object
    const volcanoData = {
      volcano: currVolcano,
      gases: gasesData,
      earthquakes: earthquakeData,
      eruptions: eruptionData,
      weather: weatherData,
      soil: soilData,
      magma: magmaData,
    };

    // Convert the data to JSON
    const jsonData = JSON.stringify(volcanoData, null, 2);

    // Trigger download
    downloadFile(jsonData, `${currVolcano.name}_data.json`, "application/json");

    console.log("Download started for volcano data");
  } catch (error) {
    console.error("Error downloading volcano data:", error);
  }
};

export default function NavBar() {
  const { currVolcano } = useVolcanoContext();

  return (
    <header className="bg-gray-200 p-4 px-28 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center text-black text-xl font-bold">
          <img src={logo} alt="Logo" className="h-12 w-13 mr-2" />
          VAMS
        </Link>
        <SelectVolcano />
        <DialogEditVolcano />
        <AlertDownload onConfirm={() => currVolcano && handleDownload(currVolcano)} currVolcanoName={currVolcano?.name || ""} />
      </div>
      <nav className="space-x-6">
        {routes.map((route) => (
          <Link
            key={route.name}
            to={route.path}
            className="text-black hover:text-gray-400"
          >
            {route.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}