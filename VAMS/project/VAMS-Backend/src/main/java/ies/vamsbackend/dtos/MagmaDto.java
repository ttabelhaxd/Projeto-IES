package ies.vamsbackend.dtos;

import ies.vamsbackend.entities.Magma;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class MagmaDto {

    private List<Magma> magmaList;

}
