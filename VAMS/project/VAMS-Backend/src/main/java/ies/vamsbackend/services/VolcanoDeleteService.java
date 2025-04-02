package ies.vamsbackend.services;

import ies.vamsbackend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class VolcanoDeleteService {

    @Autowired
    private EarthquakeRepository earthquakeRepository;

    @Autowired
    private ErosionRepository erosionRepository;

    @Autowired
    private EruptionRepository eruptionRepository;

    @Autowired
    private GasesRepository gasesRepository;

    @Autowired
    private HumidityRepository humidityRepository;

    @Autowired
    private MagmaRepository magmaRepository;

    @Autowired
    private PressureRepository pressureRepository;

    @Autowired
    private SoilRepository soilRepository;

    @Autowired
    private TemperatureRepository temperatureRepository;

    @Autowired
    private WindRepository windRepository;

    @Transactional
    public void deleteVolcanoRelatedData(UUID volcanoId) {
        try {
            earthquakeRepository.deleteByKeyVolcanoId(volcanoId);
            erosionRepository.deleteByKeyVolcanoId(volcanoId);
            eruptionRepository.deleteByKeyVolcanoId(volcanoId);
            gasesRepository.deleteByKeyVolcanoId(volcanoId);
            humidityRepository.deleteByKeyVolcanoId(volcanoId);
            magmaRepository.deleteByKeyVolcanoId(volcanoId);
            pressureRepository.deleteByKeyVolcanoId(volcanoId);
            soilRepository.deleteByKeyVolcanoId(volcanoId);
            temperatureRepository.deleteByKeyVolcanoId(volcanoId);
            windRepository.deleteByKeyVolcanoId(volcanoId);

        } catch (Exception e) {
            throw new RuntimeException("Failed to delete volcano and related data: " + e.getMessage(), e);
        }
    }

}
