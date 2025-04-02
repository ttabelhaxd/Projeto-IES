package ies.vamsbackend.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import ies.vamsbackend.dtos.MagmaDto;

public interface MagmaService {

  void downloadData();

  MagmaDto getMagma(UUID volcano_id, List<LocalDateTime> dates);

}
