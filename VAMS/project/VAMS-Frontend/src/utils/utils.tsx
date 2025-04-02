import { Volcano, Gas, Weather, SoilData } from "./interfaces.tsx"


export const fetchData = async () => {
  try {
    // console.log('Fetching data');

    const response = await fetch('/api/v1/volcanoes');
    const data: Volcano[] = await response.json(); // Ensure data is an array of Volcano

    // console.log('Data:', data);
    return data
  } catch (error: any) {
    // console.error("API Error:", error.message);
    throw error;
  }
};

const formatDate = (date: Date) => date.toISOString().slice(0, -1);


export const getVolcanoById = async (id: string) => {
  try {
    // console.log('Getting Volcano:', id);

    const response = await fetch(`/api/v1/volcano/${id}`);
    const data: Volcano = await response.json();

    // console.log('Volcano:', data);
    return data
  } catch (error: any) {
    // console.error("API Error:", error.message);
    throw error;

  }
};



export const getEarthquakeData = async (currVolcano: Volcano, startDate: Date, endDate: Date) => {
  try {
    // console.log("Retrieving earthquake data of volcano: " + currVolcano)

    const response = await fetch(`/api/v1/${currVolcano?.id}/earthquakes?start=${formatDate(startDate)}&end=${formatDate(endDate)}`);
    const data = await response.json();

    // console.log('Data:', data);
    return data.earthquakeData
  } catch (error: any) {
    // console.error("API Error:", error.message);
    throw error;
  }
}

export const getEruptionData = async (currVolcano: Volcano, startDate: Date, endDate: Date) => {
  try {
    // console.log("Retrieving Eruption data of volcano: " + currVolcano?.id)

    const start = startDate ? formatDate(startDate) : null;
    const end = endDate ? formatDate(endDate) : null;

    const response = await fetch(`/api/v1/${currVolcano?.id}/eruption?start=${start}&end=${end}`);
    const data = await response.json();

    // console.log('Data:', data.eruptionData);
    return data.eruptionData
  } catch (error: any) {
    // console.error("API Error:", error.message);
    throw error;
  }
}

export const getGasesData = async (currVolcano: Volcano, gasesFilter: string[], startDate: Date, endDate: Date) => {
  try {
    // console.log("Retrieving Gases data of volcano: " + currVolcano)
    const url = `/api/v1/${currVolcano?.id}/gases?gases=${gasesFilter.join(',')}&start=${formatDate(startDate)}&end=${formatDate(endDate)}`;

    // console.log("Gases - url: ", url)

    const response = await fetch(url);
    const data: Gas[] = await response.json();

    // console.log('Data:', data);
    return data;
  } catch (error: any) {
    // console.error("API Error:", error.message);
    throw error;
  }
}

export const getWeatherData = async (currVolcano: Volcano, startDate: Date, endDate: Date) => {
  try {
    // console.log("Retrieving Weather data of volcano: " + currVolcano)

    const response = await fetch(`/api/v1/${currVolcano?.id}/weather?start=${formatDate(startDate)}&end=${formatDate(endDate)}`);
    const data = await response.json();

    const weatherData: Weather = transformToweatherData(data);
    // console.log('Data:', weatherData);
    return weatherData
  } catch (error: any) {
    // console.error("API Error:", error.message);
    throw error;
  }
}

function transformToweatherData(response: any): Weather {
  const pressure = response.pressure.map((item: any) => ({
    pressureValue: item.pressureValue,
    timestamp: item.timestamp,
  }));

  const wind = response.wind.map((item: any) => ({
    windSpeed: item.windSpeed,
    timestamp: item.timestamp,
  }));

  const temperature = response.temperature.map((item: any) => ({
    temperatureValue: item.temperatureValue,
    timestamp: item.timestamp,
  }));

  const humidity = response.humidity.map((item: any) => ({
    humidityValue: item.humidityValue,
    timestamp: item.timestamp,
  }));

  return { pressure, wind, temperature, humidity };
}

export const getSoilData = async (currVolcano: Volcano, startDate: Date, endDate: Date) => {
  try {
    // console.log("Retrieving Weather data of volcano: " + currVolcano)

    const response = await fetch(`/api/v1/${currVolcano?.id}/soil?start=${formatDate(startDate)}&end=${formatDate(endDate)}`);
    const data = await response.json();

    const soilData: SoilData = transformToSoilData(data);
    // console.log('Data:', soilData);
    return soilData
  } catch (error: any) {
    // console.error("API Error:", error.message);
    throw error;
  }
}

function transformToSoilData(response: any): SoilData {
  const soil = response.soilData.map((item: any) => ({
    type: item.type,
    humidity: item.humidity,
    landslideProb: item.landslideProbability,
    timestamp: item.timestamp,
  }));

  const erosion = response.erosionData.map((item: any) => ({
    erosionValue: item.erosionRate,
    timestamp: item.timestamp,
  }));

  return { soil, erosion };
}

export const getMagmaData = async (currVolcano: Volcano, startDate: Date, endDate: Date) => {
  try {
    // console.log("Retrieving Magma data of volcano: " + currVolcano)

    const response = await fetch(`/api/v1/${currVolcano?.id}/magma?start=${formatDate(startDate)}&end=${formatDate(endDate)}`);
    const data = await response.json();

    // console.log('Data:', data);
    return data
  } catch (error: any) {
    // console.error("API Error:", error.message);
    throw error;
  }
}

export const addVolcano = async (data: Volcano) => {
  try {
    // console.log("Adding new volcano", data);

    const response = await fetch('/api/v1/volcano', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to add volcano: ${response.statusText}`);
    }

    const responseData = await response.json();
    // console.log('Data:', responseData);
    return responseData;
  } catch (error: any) {
    // console.error("API Error:", error.message);
    throw error;
  }
}

export const editVolcano = async (data: Volcano, id: string) => {
  try {
    // console.log("Editing current volcano", data);

    const response = await fetch(`/api/v1/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to edit volcano: ${response.statusText}`);
    }

    const responseData = await response.json();
    // console.log('Data:', responseData);
    return responseData;
  } catch (error: any) {
    // console.error("API Error:", error.message);
    throw error;
  }
}

export const deleteVolcano = async (id: string) => {
  try {
    // console.log("Deleting volcano");

    const response = await fetch(`/api/v1/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete volcano: ${response.statusText}`);
    }

    // console.log('Volcano deleted successfully');
  } catch (error: any) {
    // console.error("API Error:", error.message);
    throw error;
  }
}
