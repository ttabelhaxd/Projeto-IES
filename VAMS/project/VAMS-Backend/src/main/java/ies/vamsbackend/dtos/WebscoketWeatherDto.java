package ies.vamsbackend.dtos;

import ies.vamsbackend.entities.Humidity;
import ies.vamsbackend.entities.Pressure;
import ies.vamsbackend.entities.Temperature;
import ies.vamsbackend.entities.Wind;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WebscoketWeatherDto {

  private Pressure pressure;
  private Humidity humidity;
  private Temperature temperature;
  private Wind wind;

}
