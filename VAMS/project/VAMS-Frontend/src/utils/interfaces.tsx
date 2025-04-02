export interface Volcano {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
}

export interface Earthquake {
  latitude: number;
  longitude: number;
  magnitude: number;
  depth: number
  location: string;
  source: string;
  timestamp: string;
  volcanoid: string;
}

export interface Eruption {
  type: string;
  vei: number;
  description: string;
  timestamp: string;
  volcanoid: string;
}

export interface Gas {
  H2S: number;
  CO2: number;
  SO2: number;
  HCL: number;
  timestamp: string;
  volcanoid: string;
}

export interface Magma {
  silicon: number;
  iron: number;
  aluminum: number;
  calcium: number;
  sodium: number;
  magnesium: number;
  potassium: number;
  viscosity: number;
  timestamp: string;
  volcanoid: string;
}

export interface Pressure {
  pressureValue: number;
  timestamp: string;
}

export interface Wind {
  windSpeed: number;
  timestamp: string;
}

export interface Temperature {
  temperatureValue: number;
  timestamp: string;
}

export interface Humidity {
  humidityValue: number;
  timestamp: string;
}

export interface Weather {
  pressure: Pressure[];
  wind: Wind[];
  temperature: Temperature[];
  humidity: Humidity[]
}

export interface Erosion {
  erosionValue: number;
  timestamp: string;
}

export interface Soil {
  type: string;
  humidity: number;
  landslideProb: number;
  timestamp: string;
}

export interface SoilData {
  soil: Soil[]
  erosion: Erosion[]
}
