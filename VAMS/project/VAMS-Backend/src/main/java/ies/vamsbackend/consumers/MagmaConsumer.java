package ies.vamsbackend.consumers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import ies.vamsbackend.entities.Magma;
import ies.vamsbackend.repositories.MagmaRepository;
import ies.vamsbackend.utils.WebSocketHandler;

@Service
public class MagmaConsumer {

  private static final Logger logger = LoggerFactory.getLogger(MagmaConsumer.class);

  @Autowired
  private MagmaRepository magmaRepository;

  @Autowired
  private WebSocketHandler webSocketHandler;

  @KafkaListener(topics = "magma-topic")
  public void consume(String magmaStr) {
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.registerModule(new JavaTimeModule());
    try {
      Magma magma = objectMapper.readValue(magmaStr, Magma.class);
      magmaRepository.save(magma);
      logger.info(String.format("Received magma -> %s", magma));
      webSocketHandler.sendMessageToAddress(magma.getVolcanoId().toString(), "magma", magma.toString());
    } catch (Exception e) {
      e.printStackTrace();

    }
  }

}
