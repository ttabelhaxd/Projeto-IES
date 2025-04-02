package ies.vamsbackend.consumers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import ies.vamsbackend.entities.Earthquake;
import ies.vamsbackend.repositories.EarthquakeRepository;
import ies.vamsbackend.utils.WebSocketHandler;


@Service
public class EarthquakeConsumer {

  private static final Logger logger = LoggerFactory.getLogger(EarthquakeConsumer.class);

  @Autowired
  private EarthquakeRepository earthquakeRepository;

  @Autowired
  private WebSocketHandler webSocketHandler;

  @KafkaListener(topics = "earthquake-topic")
  public void consume(String earthquakeStr) {
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.registerModule(new JavaTimeModule());
    try {
      Earthquake earthquake = objectMapper.readValue(earthquakeStr, Earthquake.class);
      earthquakeRepository.save(earthquake);
      logger.info(String.format("Received earthquake -> %s", earthquake));
      webSocketHandler.sendMessageToAddress(earthquake.getVolcanoId().toString(), "earthquake", earthquake.toString());
    } catch (Exception e) {
      e.printStackTrace();
    }
  }


}
