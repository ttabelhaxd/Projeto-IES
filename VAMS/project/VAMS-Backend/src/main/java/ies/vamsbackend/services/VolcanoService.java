package ies.vamsbackend.services;

import ies.vamsbackend.entities.Volcano;

import java.util.List;
import java.util.UUID;

public interface VolcanoService {

  void addVolcano(Volcano volcano);

  Volcano getVolcanoById(UUID volcanoId);

  Volcano updateVolcano(Volcano volcano);

  List<Volcano> getAllVolcanoes();

  void deleteVolcanoById(UUID volcanoId);

  void downloadData();

}
