package ies.vamsbackend.consumers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import ies.vamsbackend.entities.Gases;
import ies.vamsbackend.repositories.GasesRepository;
import ies.vamsbackend.utils.WebSocketHandler;

@Service
public class GasesConsumer {

  private static final Logger logger = LoggerFactory.getLogger(GasesConsumer.class);

  @Autowired
  private GasesRepository gasesRepository;

  @Autowired
  private WebSocketHandler webSocketHandler;

  @KafkaListener(topics = "gases-topic")
  public void consume(String gasesStr) {
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.registerModule(new JavaTimeModule());
    try {
      Gases gases = objectMapper.readValue(gasesStr, Gases.class);
      gasesRepository.save(gases);
      logger.info(String.format("Received gases -> %s", gases));
      webSocketHandler.sendMessageToAddress(gases.getVolcanoId().toString(), "gases", gases.toString());
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

}
