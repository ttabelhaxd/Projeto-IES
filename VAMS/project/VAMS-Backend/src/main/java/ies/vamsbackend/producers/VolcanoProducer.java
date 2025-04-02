package ies.vamsbackend.producers;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import ies.vamsbackend.entities.Volcano;
import ies.vamsbackend.repositories.VolcanoRepository;

@Component
public class VolcanoProducer {

  private static final Logger logger = LoggerFactory.getLogger(VolcanoProducer.class);

  @Autowired
  private VolcanoRepository volcanoRepository;

  @Autowired
  private KafkaTemplate<String, Object> kafkaTemplate;

  @EventListener(ApplicationReadyEvent.class)
  public void sendAllVolcanos() {
    for (Volcano v : volcanoRepository.findAll()) {
      String jsonMessage = formatMessage(v, "add");
      kafkaTemplate.send("volcano-topic", jsonMessage);
      logger.info(String.format("Message sent -> %s", jsonMessage));
    }
  }

  public void addVolcano(Volcano volcano) {

    String jsonMessage = formatMessage(volcano, "add");

    kafkaTemplate.send("volcano-topic", jsonMessage);
    logger.info(String.format("Message sent -> %s", jsonMessage));
  }

  public void deleteVolcano(String uuid) {

    Map<String, Object> messageData = new HashMap<>();
    messageData.put("id", uuid);
    messageData.put("action", "delete");

    String jsonMessage;

    try {
      jsonMessage = new ObjectMapper().writeValueAsString(messageData);
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Failed to serialize Volcano to JSON", e);
    }

    kafkaTemplate.send("volcano-topic", jsonMessage);
    logger.info(String.format("Message sent -> %s", jsonMessage));
  }

  private static String formatMessage(Volcano volcano, String action) {
    Map<String, Object> messageData = new HashMap<>();
    messageData.put("id", volcano.getId().toString());
    messageData.put("action", action);
    messageData.put("name", volcano.getName());
    messageData.put("latitude", volcano.getLatitude());
    messageData.put("longitude", volcano.getLongitude());

    String jsonMessage;

    try {
      jsonMessage = new ObjectMapper().writeValueAsString(messageData);
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Failed to serialize Volcano to JSON", e);
    }

    return jsonMessage;
  }

}
