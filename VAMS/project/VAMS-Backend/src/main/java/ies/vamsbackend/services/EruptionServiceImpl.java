package ies.vamsbackend.services;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import ies.vamsbackend.dtos.EruptionDto;
import ies.vamsbackend.entities.Eruption;
import ies.vamsbackend.repositories.EruptionRepository;
import ies.vamsbackend.utils.Utils;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class EruptionServiceImpl implements Serializable, EruptionService {

  private final EruptionRepository eruptionRepository;

  private EruptionDto getEruptionList(UUID volcano_id) {
    List<Eruption> eruptionList = eruptionRepository.findByKeyVolcanoId(volcano_id);

    return new EruptionDto(eruptionList);
  }

  private EruptionDto getEruptionListByDate(UUID volcano_id, LocalDateTime startDate, LocalDateTime endDate) {
    List<Eruption> eruptionList = eruptionRepository.findByKeyVolcanoIdAndKeyTimestampBetween(volcano_id, startDate,
        endDate);

    return new EruptionDto(eruptionList);
  }

  @Override
  public EruptionDto getEruption(UUID volcano_id, List<LocalDateTime> dates) {

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
      return getEruptionListByDate(volcano_id, startDate, endDate);
    }
    return getEruptionList(volcano_id);
  }

  public void downloadData() {

  }

}
