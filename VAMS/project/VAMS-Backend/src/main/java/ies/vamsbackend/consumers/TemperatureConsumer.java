package ies.vamsbackend.consumers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import ies.vamsbackend.entities.Temperature;
import ies.vamsbackend.repositories.TemperatureRepository;

@Service
public class TemperatureConsumer {

    private static final Logger logger = LoggerFactory.getLogger(TemperatureConsumer.class);

    @Autowired
    private TemperatureRepository temperatureRepository;

    @KafkaListener(topics = "temperature-topic")
    public void consume(String temperatureStr) {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        try {
            Temperature temperature = objectMapper.readValue(temperatureStr, Temperature.class);
            temperatureRepository.save(temperature);
            logger.info("Received temperature -> {}", temperature);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
