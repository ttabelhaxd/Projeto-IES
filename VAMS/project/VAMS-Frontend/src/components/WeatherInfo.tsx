interface WeatherInfoProps {
    date: string;
    volcanoName: string;
    temperature: number;
    humidity: number;
    pressure: number;
    wind: number;
    icon: string;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({
    date,
    volcanoName,
    temperature,
    humidity,
    pressure,
    wind,
    icon,
}) => {
    return (
        <div className="weather-info flex justify-between items-center text-center m-14 p-1 mx-auto w-1/2 text-3xl bg-white">

            <div className="flex flex-row w-full items-center">
                <img src={icon} alt="Weather Icon" className="w-32 h-32 mr-1" />
                <div className="flex flex-col w-full">
                    <p className="font-medium text-gray-800">{date}</p>
                    <p className="font-medium text-gray-800">{volcanoName}</p>
                    <p className="font-medium text-gray-800">{temperature}°C</p>
                </div>
            </div>

            <div className="flex flex-col w-full">
                <p className="font-medium text-gray-800">Pressure: {pressure.toFixed(2)} hPa</p>
                <p className="font-medium text-gray-800">Humidity: {humidity.toFixed(2)}%</p>
                <p className="font-medium text-gray-800">Wind: {wind.toFixed(2)} m/s</p>
            </div>
        </div>
    );
};

export default WeatherInfo;
