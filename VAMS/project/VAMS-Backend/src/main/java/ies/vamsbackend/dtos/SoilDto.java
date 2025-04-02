package ies.vamsbackend.dtos;

import ies.vamsbackend.entities.Erosion;
import ies.vamsbackend.entities.Soil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SoilDto {

    private List<Soil> soilData;
    private List<Erosion> erosionData;

}
