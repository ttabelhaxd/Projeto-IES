package ies.vamsbackend.services;

import ies.vamsbackend.dtos.WeatherDto;
import ies.vamsbackend.entities.Humidity;
import ies.vamsbackend.entities.Pressure;
import ies.vamsbackend.entities.Temperature;
import ies.vamsbackend.entities.Wind;
import ies.vamsbackend.repositories.HumidityRepository;
import ies.vamsbackend.repositories.PressureRepository;
import ies.vamsbackend.repositories.TemperatureRepository;
import ies.vamsbackend.repositories.WindRepository;
import ies.vamsbackend.utils.Utils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@Service
public class WeatherServiceImpl implements Serializable, WeatherService {

  private PressureRepository pressureRepository;
  private HumidityRepository humidityRepository;
  private TemperatureRepository temperatureRepository;
  private WindRepository windRepository;

  private WeatherDto getWeather(UUID volcano_id) {
    List<Pressure> pressure = pressureRepository.findByKeyVolcanoId(volcano_id);
    List<Humidity> humidity = humidityRepository.findByKeyVolcanoId(volcano_id);
    List<Temperature> temperature = temperatureRepository.findByKeyVolcanoId(volcano_id);
    List<Wind> wind = windRepository.findByKeyVolcanoId(volcano_id);

    return new WeatherDto(pressure, humidity, temperature, wind);
  }

  private WeatherDto getWeatherByDate(UUID volcano_id, LocalDateTime startDate, LocalDateTime endDate) {
    List<Pressure> pressure = pressureRepository.findByKeyVolcanoIdAndKeyTimestampBetween(volcano_id, startDate,
        endDate);
    List<Humidity> humidity = humidityRepository.findByKeyVolcanoIdAndKeyTimestampBetween(volcano_id, startDate,
        endDate);
    List<Temperature> temperature = temperatureRepository.findByKeyVolcanoIdAndKeyTimestampBetween(volcano_id,
        startDate, endDate);
    List<Wind> wind = windRepository.findByKeyVolcanoIdAndKeyTimestampBetween(volcano_id, startDate, endDate);

    return new WeatherDto(pressure, humidity, temperature, wind);
  }

  @Override
  public WeatherDto getWeather(UUID volcano_id, List<LocalDateTime> dates) {

    LocalDateTime startDate;
    LocalDateTime endDate;

    if (dates == null) {
      startDate = null;
      endDate = null;
    } else {
      startDate = dates.get(0);
      endDate = dates.get(1);
    }

    if (startDate != null && endDate != null) {
      Utils.validateDateRange(startDate, endDate);
      return getWeatherByDate(volcano_id, startDate, endDate);
    }
    return getWeather(volcano_id);
  }

  public void downloadData() {

  }

}
