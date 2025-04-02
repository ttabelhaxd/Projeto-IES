package ies.vamsbackend.consumers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import ies.vamsbackend.entities.Erosion;
import ies.vamsbackend.repositories.ErosionRepository;
import ies.vamsbackend.utils.WebSocketHandler;

@Service
public class ErosionConsumer {

  private static final Logger logger = LoggerFactory.getLogger(ErosionConsumer.class);

  @Autowired
  private ErosionRepository erosionRepository;

  @Autowired
  private WebSocketHandler webSocketHandler;

  @KafkaListener(topics = "erosion-topic")
  public void consume(String erosionStr) {
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.registerModule(new JavaTimeModule());
    try {
      Erosion erosion = objectMapper.readValue(erosionStr, Erosion.class);
      erosionRepository.save(erosion);
      logger.info(String.format("Received erosion -> %s", erosion));
      webSocketHandler.sendMessageToAddress(erosion.getVolcanoId().toString(), "erosion", erosion.toString());
    } catch (Exception e) {
      e.printStackTrace();

    }

  }

}
