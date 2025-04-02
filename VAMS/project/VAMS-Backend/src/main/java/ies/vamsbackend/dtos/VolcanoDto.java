package ies.vamsbackend.dtos;

import ies.vamsbackend.entities.Volcano;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VolcanoDto {

    private String name;
    private String description;
    private double latitude;
    private double longitude;

    public VolcanoDto(Volcano volcano) {
        this.name = volcano.getName();
        this.description = volcano.getDescription();
        this.latitude = volcano.getLatitude();
        this.longitude = volcano.getLongitude();
    }

}
