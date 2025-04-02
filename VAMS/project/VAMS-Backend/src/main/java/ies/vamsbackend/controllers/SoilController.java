package ies.vamsbackend.controllers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import ies.vamsbackend.services.VolcanoValidationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ies.vamsbackend.dtos.SoilDto;
import ies.vamsbackend.exceptions.InvalidRequestException;
import ies.vamsbackend.services.SoilService;
import ies.vamsbackend.utils.Utils;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1")
public class SoilController {

    private final SoilService soilService;
    private final VolcanoValidationService volcanoValidationService;

    @GetMapping("/{volcano_id}/soil")
    public ResponseEntity<?> getSoil(
            @PathVariable String volcano_id,
            @RequestParam(required = false, value = "start") String startDate,
            @RequestParam(required = false, value = "end") String endDate) {

        try {
            List<LocalDateTime> dates = Utils.validateDates(startDate, endDate);
            UUID volcanoId = volcanoValidationService.validateVolcanoId(volcano_id);
            SoilDto response = soilService.getSoil(volcanoId, dates);
            return ResponseEntity.ok(response);

        } catch (InvalidRequestException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}
