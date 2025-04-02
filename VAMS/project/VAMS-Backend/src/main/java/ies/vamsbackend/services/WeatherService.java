package ies.vamsbackend.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import ies.vamsbackend.dtos.WeatherDto;

public interface WeatherService {

  void downloadData();

  WeatherDto getWeather(UUID volcano_id, List<LocalDateTime> dates);

}
