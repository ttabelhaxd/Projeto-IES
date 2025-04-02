import { Link } from "react-router-dom";
import sta_barbara from "@/assets/sta_barbara.png";
import earthquakeCard from "@/assets/earthquakeCard.png";
import magmaCard from "@/assets/magmaCard.png";
import soilAnalysisCard from "@/assets/soilAnalysisCard.png";
import weatherCard from "@/assets/weatherCard.png";
import volcanicGasesCard from "@/assets/volcanicGasesCard.png";
import volcanoHistoryCard from "@/assets/volcanoHistoryCard.png";

interface Route {
  name: string;
  path: string;
  imgURL: string;
}

const routes: Route[] = [
  {
    name: "Earthquakes",
    path: "/earthquakes",
    imgURL: earthquakeCard,
  },
  {
    name: "Magma",
    path: "/magma",
    imgURL: magmaCard,
  },
  {
    name: "Soil Analysis",
    path: "/soil-analysis",
    imgURL: soilAnalysisCard,
  },
  {
    name: "Weather",
    path: "/weather",
    imgURL: weatherCard,
  },
  {
    name: "Volcanic Gases",
    path: "/volcanic-gases",
    imgURL: volcanicGasesCard,
  },
  {
    name: "Volcanic History",
    path: "/volcanic-history",
    imgURL: volcanoHistoryCard,
  },
];

export function Component() {
  
  return (
    <main>
      <div
        className="bg-cover bg-center h-[30rem] content-center grid place-content-center gap-4"
        style={{ backgroundImage: `url(${sta_barbara})` }}
      >
        <p className="font-black text-7xl">VAMS</p>
        <p className="text-xl">
          Get to know more with real time volcanic information
        </p>
      </div>

      <div className="grid grid-cols-3 container gap-32 my-16 mx-auto"> 
        {routes.map((route) => (
          <Link key={route.name} to={route.path} className="shadow rounded-3xl transform transition duration-75 hover:scale-105 overflow-hidden border">
            <img src={route.imgURL} alt={route.name} className="aspect-square w-full object-cover" />
            <div className="p-4">
              <p className="text-lg font-semibold text-center">{route.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
