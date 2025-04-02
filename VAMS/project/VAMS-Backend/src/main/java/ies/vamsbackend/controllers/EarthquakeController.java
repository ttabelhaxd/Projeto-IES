package ies.vamsbackend.controllers;

import ies.vamsbackend.dtos.EarthquakeDto;
import ies.vamsbackend.exceptions.InvalidRequestException;
import ies.vamsbackend.services.EarthquakeService;
import ies.vamsbackend.services.VolcanoValidationService;
import ies.vamsbackend.utils.Utils;
import lombok.AllArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1")
public class EarthquakeController {

    private final EarthquakeService earthquakeService;
    private final VolcanoValidationService volcanoValidationService;

    @GetMapping("/{volcano_id}/earthquakes")
    public ResponseEntity<?> getEarthquakes(
            @PathVariable String volcano_id,
            @RequestParam(required = false, value = "start") String startDate,
            @RequestParam(required = false, value = "end") String endDate) {

        try {
            List<LocalDateTime> dates = Utils.validateDates(startDate, endDate);
            UUID volcanoId = volcanoValidationService.validateVolcanoId(volcano_id);
            EarthquakeDto response = earthquakeService.getEarthquake(volcanoId, dates);
            return ResponseEntity.ok(response);

        } catch (InvalidRequestException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}
