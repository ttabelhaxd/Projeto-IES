package ies.vamsbackend.controllers;

import ies.vamsbackend.dtos.*;
import ies.vamsbackend.entities.Volcano;
import ies.vamsbackend.services.*;
import lombok.AllArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1")
public class VolcanoController {

  private VolcanoService volcanoService;
  private VolcanoValidationService volcanoValidationService;

  @PostMapping("/volcano")
  public ResponseEntity<?> createVolcano(
      @RequestBody Volcano volcano) {

    volcanoService.addVolcano(volcano);
    return ResponseEntity.ok(volcano);
  }

  @GetMapping("/{volcano_id}")
  public ResponseEntity<?> getVolcanoById(
      @PathVariable String volcano_id) {

    try {
      UUID validatedId = volcanoValidationService.validateVolcanoId(volcano_id);
      VolcanoDto volcano = new VolcanoDto(volcanoService.getVolcanoById(validatedId));
      return ResponseEntity.ok(volcano);

    } catch (IllegalArgumentException e) {
      return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }

  @PutMapping("/{volcano_id}")
  public ResponseEntity<?> updateVolcano(
      @PathVariable String volcano_id,
      @RequestBody VolcanoDto volcanoDto) {

    try {
      Volcano volcano = new Volcano(volcanoDto);
      UUID validatedId = volcanoValidationService.validateVolcanoId(volcano_id);
      volcano.setId(validatedId);
      Volcano newVolcano = volcanoService.updateVolcano(volcano);
      return ResponseEntity.ok(newVolcano);

    } catch (IllegalArgumentException e) {
      return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }

  @DeleteMapping("/{volcano_id}")
  public ResponseEntity<?> deleteVolcano(
      @PathVariable String volcano_id) {

    try {
      UUID validatedId = volcanoValidationService.validateVolcanoId(volcano_id);
      volcanoService.deleteVolcanoById(validatedId);
      return ResponseEntity.ok(String.format("Volcano %s has been deleted", volcano_id));

    } catch (IllegalArgumentException e) {
      return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }

  @GetMapping("/volcanoes")
  public ResponseEntity<List<Volcano>> getAllVolcanoes() {
    return ResponseEntity.ok(volcanoService.getAllVolcanoes());
  }

}
