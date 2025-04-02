package ies.vamsbackend.consumers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import ies.vamsbackend.entities.Soil;
import ies.vamsbackend.repositories.SoilRepository;
import ies.vamsbackend.utils.WebSocketHandler;

@Service
public class SoilConsumer {

  private static final Logger logger = LoggerFactory.getLogger(SoilConsumer.class);

  @Autowired
  private SoilRepository soilRepository;

  @Autowired
  private WebSocketHandler webSocketHandler;

  @KafkaListener(topics = "soil-topic")
  public void consume(String soilStr) {
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.registerModule(new JavaTimeModule());
    try {
      Soil soil = objectMapper.readValue(soilStr, Soil.class);
      soilRepository.save(soil);
      logger.info(String.format("Received soil -> %s", soil));
      webSocketHandler.sendMessageToAddress(soil.getVolcanoId().toString(), "soil", soil.toString());
    } catch (Exception e) {
      e.printStackTrace();

    }
  }

}
