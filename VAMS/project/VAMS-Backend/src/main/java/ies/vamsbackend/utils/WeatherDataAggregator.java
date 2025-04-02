package ies.vamsbackend.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;

import ies.vamsbackend.dtos.WebscoketWeatherDto;
import ies.vamsbackend.entities.Humidity;
import ies.vamsbackend.entities.Pressure;
import ies.vamsbackend.entities.Temperature;
import ies.vamsbackend.entities.Wind;

public class WeatherDataAggregator {

  private Wind wind;
  private Pressure pressure;
  private Humidity humidity;
  private Temperature temperature;

  public synchronized void setWind(Wind wind) {
    this.wind = wind;
  }

  public synchronized void setPressure(Pressure pressure) {
    this.pressure = pressure;
  }

  public synchronized void setHumidity(Humidity humidity) {
    this.humidity = humidity;
  }

  public synchronized void setTemperature(Temperature temperature) {
    this.temperature = temperature;
  }

  @JsonIgnore
  public synchronized boolean isComplete() {
    return wind != null && pressure != null && humidity != null && temperature != null;
  }

  public synchronized void clear() {
    wind = null;
    pressure = null;
    humidity = null;
    temperature = null;
  }

  public synchronized String toJson() {
    ObjectMapper objectMapper = new ObjectMapper();
    JavaTimeModule javaTimeModule = new JavaTimeModule();
    javaTimeModule.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(DateTimeFormatter.ISO_DATE_TIME));
    objectMapper.registerModule(javaTimeModule);
    objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
    try {
      return objectMapper
          .writeValueAsString(new WebscoketWeatherDto(this.pressure, this.humidity, this.temperature, this.wind));
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Failed to serialize Volcano to JSON", e);
    }
  }
}
