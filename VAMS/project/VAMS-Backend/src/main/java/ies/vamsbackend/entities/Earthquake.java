package ies.vamsbackend.entities;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;

import ies.vamsbackend.keys.EntityKey;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table
public class Earthquake {

  @PrimaryKey
  @JsonIgnore
  private EntityKey key;
  private double latitude;
  private double longitude;
  private double magnitude;
  private double depth;
  private String location;
  private String source;

  public UUID getVolcanoId() {
    return key.getVolcanoId();
  }

  public LocalDateTime getTimestamp() {
    return key.getTimestamp();
  }

  public void setTimestamp(LocalDateTime timestamp) {
    key.setTimestamp(timestamp);
  }

  @JsonProperty("key")
  public EntityKey getKey() {
    return key;
  }

  @JsonProperty("key")
  public void setKey(EntityKey key) {
    this.key = key;
  }

  @Override
  public String toString() {
    ObjectMapper objectMapper = new ObjectMapper();
    JavaTimeModule javaTimeModule = new JavaTimeModule();
    javaTimeModule.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(DateTimeFormatter.ISO_DATE_TIME));
    objectMapper.registerModule(javaTimeModule);
    objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
    try {
      return objectMapper.writeValueAsString(this);
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Failed to serialize Volcano to JSON", e);
    }
  }
}
