package ies.vamsbackend.consumers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import ies.vamsbackend.entities.Eruption;
import ies.vamsbackend.repositories.EruptionRepository;
import ies.vamsbackend.utils.WebSocketHandler;

@Service
public class EruptionConsumer {

  private static final Logger logger = LoggerFactory.getLogger(EruptionConsumer.class);

  @Autowired
  private EruptionRepository eruptionRepository;

  @Autowired
  private WebSocketHandler webSocketHandler;

  @KafkaListener(topics = "eruption-topic")
  public void consume(String eruptionStr) {
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.registerModule(new JavaTimeModule());
    try {
      Eruption eruption = objectMapper.readValue(eruptionStr, Eruption.class);
      eruptionRepository.save(eruption);
      logger.info(String.format("Received eruption -> %s", eruption));
      webSocketHandler.sendMessageToAddress(eruption.getVolcanoId().toString(), "eruptions", eruption.toString());
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
