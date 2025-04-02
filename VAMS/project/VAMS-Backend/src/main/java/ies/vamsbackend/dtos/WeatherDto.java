package ies.vamsbackend.dtos;


import ies.vamsbackend.entities.Humidity;
import ies.vamsbackend.entities.Pressure;
import ies.vamsbackend.entities.Temperature;
import ies.vamsbackend.entities.Wind;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class WeatherDto {

    private List<Pressure> pressure;
    private List<Humidity> humidity;
    private List<Temperature> temperature;
    private List<Wind> wind;

}
