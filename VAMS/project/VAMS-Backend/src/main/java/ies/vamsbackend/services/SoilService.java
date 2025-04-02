package ies.vamsbackend.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import ies.vamsbackend.dtos.SoilDto;

public interface SoilService {

  void downloadData();

  SoilDto getSoil(UUID volcano_id, List<LocalDateTime> dates);

}
