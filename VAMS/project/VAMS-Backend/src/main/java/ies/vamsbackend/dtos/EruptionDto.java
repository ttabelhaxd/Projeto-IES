package ies.vamsbackend.dtos;

import ies.vamsbackend.entities.Eruption;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class EruptionDto {

    private List<Eruption> eruptionData;

}
