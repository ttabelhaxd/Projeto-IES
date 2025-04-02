package ies.vamsbackend.entities;

import java.util.UUID;

import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import ies.vamsbackend.dtos.VolcanoDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table("volcano")
public class Volcano {

  @PrimaryKey
  private UUID id;

  private String name;

  private String description;

  private double latitude;

  private double longitude;

  public Volcano(VolcanoDto volcanoDto) {
    this.name = volcanoDto.getName();
    this.description = volcanoDto.getDescription();
    this.latitude = volcanoDto.getLatitude();
    this.longitude = volcanoDto.getLongitude();
  }

  public Volcano(String name, String description, double latitude, double longitude) {
    this.name = name;
    this.description = description;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  @Override
  public String toString() {
    ObjectMapper objectMapper = new ObjectMapper();
    try {
      return objectMapper.writeValueAsString(this);
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Failed to serialize Volcano to JSON", e);
    }
  }

}
