package ies.vamsbackend.services;

import ies.vamsbackend.dtos.GasesDto;
import ies.vamsbackend.entities.Gases;
import ies.vamsbackend.repositories.GasesRepository;
import ies.vamsbackend.utils.Utils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@Service
public class GasesServiceImpl implements Serializable, GasesService {

  private GasesRepository gasesRepository;

  private GasesDto getGasesList(List<String> gasesFilter, UUID id) {
    List<Gases> allGases = gasesRepository.findByKeyVolcanoId(id);
    return Utils.filterGases(allGases, gasesFilter);
  }

  private GasesDto getGasesListByDate(List<String> gasesFilter, LocalDateTime startDate, LocalDateTime endDate,
      UUID id) {
    List<Gases> gasesByDate = gasesRepository.findByKeyVolcanoIdAndKeyTimestampBetween(id, startDate, endDate);
    return Utils.filterGases(gasesByDate, gasesFilter);
  }

  @Override
  public GasesDto getGases(UUID volcano_id, List<String> gasesFilter, List<LocalDateTime> dates) {
    Utils.validateGases(gasesFilter);

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
      return getGasesListByDate(gasesFilter, startDate, endDate, volcano_id);
    }
    return getGasesList(gasesFilter, volcano_id);
  }

  public void downloadData() {

  }

}
