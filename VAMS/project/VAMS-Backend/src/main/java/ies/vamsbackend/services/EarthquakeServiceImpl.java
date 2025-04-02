package ies.vamsbackend.services;

import ies.vamsbackend.dtos.EarthquakeDto;
import ies.vamsbackend.entities.Earthquake;
import ies.vamsbackend.repositories.EarthquakeRepository;
import ies.vamsbackend.utils.Utils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@Service
public class EarthquakeServiceImpl implements Serializable, EarthquakeService {

  private final EarthquakeRepository earthquakeRepository;

  private EarthquakeDto getEarthquakeList(UUID volcano_id) {
    List<Earthquake> earthquakeList = earthquakeRepository.findByKeyVolcanoId(volcano_id);

    return new EarthquakeDto(earthquakeList);
  }

  private EarthquakeDto getEarthquakeListByDate(UUID volcano_id, LocalDateTime startDate, LocalDateTime EndDate) {
    List<Earthquake> earthquakeList = earthquakeRepository.findByKeyVolcanoIdAndKeyTimestampBetween(volcano_id,
        startDate, EndDate);

    return new EarthquakeDto(earthquakeList);
  }

  @Override
  public EarthquakeDto getEarthquake(UUID volcano_id, List<LocalDateTime> dates) {
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
      return getEarthquakeListByDate(volcano_id, startDate, endDate);
    }
    return getEarthquakeList(volcano_id);
  }

  @Override
  public void downloadData() {

  }

}
