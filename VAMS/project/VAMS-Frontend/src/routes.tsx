import Layout from "./components/Layout";

export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        lazy: () => import("./pages/HomePage"),
      },
      {
        path: "/aboutus",
        lazy: () => import("./pages/AboutUsPage"),
      },
      {
        path: "/contacts",
        lazy: () => import("./pages/ContactsPage"),
      },
      {
        path: "/earthquakes",
        lazy: () => import("./pages/EarthquakesPage"),
      },
      {
        path: "/magma",
        lazy: () => import("./pages/MagmaPage"),
      },
      {
        path: "/soil-analysis",
        lazy: () => import("./pages/SoilAnalysisPage"),
      },
      {
        path: "/weather",
        lazy: () => import("./pages/WeatherPage"),
      },
      {
        path: "/volcanic-gases",
        lazy: () => import("./pages/VolcanicGasesPage"),
      },
      {
        path: "/volcanic-history",
        lazy: () => import("./pages/VolcanicHistoryPage"),
      },
    ],
  },
];
