package ies.vamsbackend.services;

import ies.vamsbackend.exceptions.InvalidRequestException;
import ies.vamsbackend.repositories.VolcanoRepository;
import ies.vamsbackend.utils.Utils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@AllArgsConstructor
@Service
public class VolcanoValidationService {

  private final VolcanoRepository volcanoRepository;

  public UUID validateVolcanoId(String volcanoId) {
    UUID uuid = Utils.getUUID(volcanoId);
    if (!volcanoRepository.existsById(uuid)) {
      throw new InvalidRequestException("Volcano with id " + volcanoId + " does not exist");
    }
    return uuid;
  }

}
