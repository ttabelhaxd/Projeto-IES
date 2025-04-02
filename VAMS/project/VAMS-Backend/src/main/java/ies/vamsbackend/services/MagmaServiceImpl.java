package ies.vamsbackend.services;

import ies.vamsbackend.dtos.MagmaDto;
import ies.vamsbackend.entities.Magma;
import ies.vamsbackend.repositories.MagmaRepository;
import ies.vamsbackend.utils.Utils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@Service
public class MagmaServiceImpl implements Serializable, MagmaService {

  private final MagmaRepository magmaRepository;

  private MagmaDto getMagma(UUID volcano_id) {
    List<Magma> magmaList = magmaRepository.findByKeyVolcanoId(volcano_id);

    return new MagmaDto(magmaList);
  }

  private MagmaDto getMagmaByDate(UUID volcano_id, LocalDateTime startDate, LocalDateTime endDate) {
    List<Magma> magmaList = magmaRepository.findByKeyVolcanoIdAndKeyTimestampBetween(volcano_id, startDate, endDate);

    return new MagmaDto(magmaList);
  }

  @Override
  public MagmaDto getMagma(UUID volcano_id, List<LocalDateTime> dates) {
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
      return getMagmaByDate(volcano_id, startDate, endDate);
    }
    return getMagma(volcano_id);
  }

  public void downloadData() {

  }

}
