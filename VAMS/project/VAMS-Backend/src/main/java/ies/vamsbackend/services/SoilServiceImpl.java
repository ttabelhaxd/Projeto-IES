package ies.vamsbackend.services;

import ies.vamsbackend.dtos.SoilDto;
import ies.vamsbackend.entities.Erosion;
import ies.vamsbackend.entities.Soil;
import ies.vamsbackend.repositories.ErosionRepository;
import ies.vamsbackend.repositories.SoilRepository;
import ies.vamsbackend.utils.Utils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@Service
public class SoilServiceImpl implements Serializable, SoilService {

  private final SoilRepository soilRepository;
  private final ErosionRepository erosionRepository;

  private SoilDto getSoilList(UUID volcano_id) {
    List<Soil> soilList = soilRepository.findByKeyVolcanoId(volcano_id);
    List<Erosion> erosionList = erosionRepository.findByKeyVolcanoId(volcano_id);

    return new SoilDto(soilList, erosionList);
  }

  private SoilDto getSoilListByDate(UUID volcano_id, LocalDateTime startDate, LocalDateTime endDate) {
    List<Soil> filteredSoilList = soilRepository.findByKeyVolcanoIdAndKeyTimestampBetween(volcano_id, startDate,
        endDate);
    List<Erosion> filteredErosionList = erosionRepository.findByKeyVolcanoIdAndKeyTimestampBetween(volcano_id,
        startDate, endDate);

    return new SoilDto(filteredSoilList, filteredErosionList);
  }

  @Override
  public SoilDto getSoil(UUID volcano_id, List<LocalDateTime> dates) {
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
      return getSoilListByDate(volcano_id, startDate, endDate);
    }
    return getSoilList(volcano_id);
  }

  public void downloadData() {

  }

}
