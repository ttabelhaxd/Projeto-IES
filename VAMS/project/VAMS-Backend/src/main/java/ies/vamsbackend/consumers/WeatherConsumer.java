package ies.vamsbackend.consumers;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import ies.vamsbackend.entities.Humidity;
import ies.vamsbackend.entities.Pressure;
import ies.vamsbackend.entities.Temperature;
import ies.vamsbackend.entities.Wind;
import ies.vamsbackend.repositories.HumidityRepository;
import ies.vamsbackend.repositories.PressureRepository;
import ies.vamsbackend.repositories.TemperatureRepository;
import ies.vamsbackend.repositories.WindRepository;
import ies.vamsbackend.utils.WeatherDataAggregator;
import ies.vamsbackend.utils.WebSocketHandler;

@Service
public class WeatherConsumer {

  private static final Logger logger = LoggerFactory.getLogger(WeatherConsumer.class);

  @Autowired
  private WindRepository windRepository;

  @Autowired
  private PressureRepository pressureRepository;

  @Autowired
  private HumidityRepository humidityRepository;

  @Autowired
  private TemperatureRepository temperatureRepository;

  @Autowired
  private WebSocketHandler webSocketHandler;

  private final WeatherDataAggregator dataAggregator = new WeatherDataAggregator();

  @KafkaListener(topics = "wind-topic")
  public void consumeWind(String windStr) {
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.registerModule(new JavaTimeModule());
    try {
      Wind wind = objectMapper.readValue(windStr, Wind.class);
      windRepository.save(wind);
      dataAggregator.setWind(wind);
      sendIfComplete(wind.getVolcanoId().toString());
      logger.info(String.format("Received wind -> %s", wind));
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  @KafkaListener(topics = "pressure-topic")
  public void consumePressure(String pressureStr) {
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.registerModule(new JavaTimeModule());
    try {
      Pressure pressure = objectMapper.readValue(pressureStr, Pressure.class);
      pressureRepository.save(pressure);
      dataAggregator.setPressure(pressure);
      sendIfComplete(pressure.getVolcanoId().toString());
      logger.info(String.format("Received pressure -> %s", pressure));
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  @KafkaListener(topics = "humidity-topic")
  public void consumeHumidity(String humidityStr) {
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.registerModule(new JavaTimeModule());
    try {
      Humidity humidity = objectMapper.readValue(humidityStr, Humidity.class);
      humidityRepository.save(humidity);
      dataAggregator.setHumidity(humidity);
      sendIfComplete(humidity.getVolcanoId().toString());
      logger.info(String.format("Received humidity -> %s", humidity));
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  @KafkaListener(topics = "temperature-topic")
  public void consume(String temperatureStr) {
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.registerModule(new JavaTimeModule());
    try {
      Temperature temperature = objectMapper.readValue(temperatureStr, Temperature.class);
      temperatureRepository.save(temperature);
      dataAggregator.setTemperature(temperature);
      sendIfComplete(temperature.getVolcanoId().toString());
      logger.info(String.format("Received temperature -> %s", temperature));
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private void sendIfComplete(String uuid) throws IOException {
    if (dataAggregator.isComplete()) {
      String aggregatedData = dataAggregator.toJson();
      webSocketHandler.sendMessageToAddress(uuid, "weather", aggregatedData);
      ;
      logger.info("Sent aggregated data -> " + aggregatedData);
      dataAggregator.clear();
    }
  }

}
