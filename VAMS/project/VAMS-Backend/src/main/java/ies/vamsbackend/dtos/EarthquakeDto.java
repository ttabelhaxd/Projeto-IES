package ies.vamsbackend.dtos;

import ies.vamsbackend.entities.Earthquake;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class EarthquakeDto {

    private List<Earthquake> earthquakeData;

}
