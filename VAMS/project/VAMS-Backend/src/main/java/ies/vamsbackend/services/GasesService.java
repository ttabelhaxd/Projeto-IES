package ies.vamsbackend.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import ies.vamsbackend.dtos.GasesDto;

public interface GasesService {

  void downloadData();

  GasesDto getGases(UUID volcano_id, List<String> gasesFilter, List<LocalDateTime> dates);

}
