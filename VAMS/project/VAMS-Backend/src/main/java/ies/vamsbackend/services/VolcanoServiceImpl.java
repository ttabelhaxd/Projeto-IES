package ies.vamsbackend.services;

import ies.vamsbackend.entities.Volcano;
import ies.vamsbackend.producers.VolcanoProducer;
import ies.vamsbackend.repositories.VolcanoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@AllArgsConstructor
@Service
public class VolcanoServiceImpl implements VolcanoService {

  private VolcanoRepository volcanoRepository;
  private VolcanoProducer volcanoProducer;
  private VolcanoDeleteService volcanoDeleteService;

  @Override
  public void addVolcano(Volcano volcano) {
    volcano.setId(UUID.randomUUID());
    volcanoRepository.save(volcano);
    volcanoProducer.addVolcano(volcano);
  }

  @Override
  public Volcano getVolcanoById(UUID volcanoId) {
    return volcanoRepository.getVolcanoById(volcanoId);
  }

  @Override
  public Volcano updateVolcano(Volcano volcano) {
    Volcano oldVolcano = volcanoRepository.getVolcanoById(volcano.getId());
    oldVolcano.setName(volcano.getName());
    oldVolcano.setDescription(volcano.getDescription());
    oldVolcano.setLatitude(volcano.getLatitude());
    oldVolcano.setLongitude(volcano.getLongitude());
    volcanoProducer.deleteVolcano(volcano.getId().toString());
    volcanoProducer.addVolcano(oldVolcano);
    return volcanoRepository.save(oldVolcano);
  }

  @Override
  @Transactional
  public void deleteVolcanoById(UUID volcanoId) {
    try {
      volcanoDeleteService.deleteVolcanoRelatedData(volcanoId);
      volcanoRepository.deleteById(volcanoId);
      volcanoProducer.deleteVolcano(volcanoId.toString());
    } catch (Exception e) {
      e.printStackTrace();
    }

  }

  @Override
  public List<Volcano> getAllVolcanoes() {
    return volcanoRepository.findAll();
  }

  public void downloadData() {

  }

}
