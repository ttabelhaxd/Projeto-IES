package ies.vamsbackend.services;

import ies.vamsbackend.dtos.EarthquakeDto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface EarthquakeService {

  void downloadData();

  EarthquakeDto getEarthquake(UUID volcano_id, List<LocalDateTime> dates);

}
