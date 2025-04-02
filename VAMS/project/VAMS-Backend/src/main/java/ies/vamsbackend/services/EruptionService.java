package ies.vamsbackend.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import ies.vamsbackend.dtos.EruptionDto;

public interface EruptionService {

  void downloadData();

  EruptionDto getEruption(UUID volcano_id, List<LocalDateTime> dates);

}
