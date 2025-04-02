package ies.vamsbackend.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import ies.vamsbackend.dtos.GasesDto;
import ies.vamsbackend.entities.Gases;
import ies.vamsbackend.exceptions.InvalidRequestException;

public class Utils {

    public static List<LocalDateTime> validateDates(String startDate, String endDate) {
        // TODO: verify dates are parsed correctly
        // TODO: if first and second are null return 2 nulls
        List<LocalDateTime> dates = new ArrayList<>();
        if (startDate == null && endDate == null) {
            return null;
        }

        try {
            dates.add(LocalDateTime.parse(startDate));
            dates.add(LocalDateTime.parse(endDate));

            return dates;

        } catch (DateTimeParseException e) {
            throw new InvalidRequestException("Dates can be parsed startDate: " + startDate + " and endDate: " + endDate);
        }
    }

    public static void validateDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new InvalidRequestException("Start date cannot be after end date");
        }
    }

    public static void validateGases(List<String> gasesFilter) {
        List<String> allowed_gases = List.of("H2S", "CO2", "SO2", "HCl");
        for (String gas : gasesFilter) {
            if (!allowed_gases.contains(gas)) {
                throw new InvalidRequestException("Invalid gases filter: " + gas + ". Allowed values are: " + allowed_gases);
            }
        }
    }

    public static GasesDto filterGases(List<Gases> gasesList, List<String> gasesFilter) {
        GasesDto gasesDto = new GasesDto();

        for (Gases gas : gasesList) {
            GasesDto.GasEntry entry = new GasesDto.GasEntry(gas.getTimestamp());

            if (gasesFilter.contains("H2S"))
                entry.setH2S(gas.getH2S());
            if (gasesFilter.contains("CO2"))
                entry.setCO2(gas.getCO2());
            if (gasesFilter.contains("SO2"))
                entry.setSO2(gas.getSO2());
            if (gasesFilter.contains("HCl"))
                entry.setHCl(gas.getHCl());

            gasesDto.addEntry(entry);
        }

        return gasesDto;
    }

    public static UUID getUUID(String volcano_id) {
        try {
            return UUID.fromString(volcano_id);
        } catch (IllegalArgumentException ex) {
            throw new InvalidRequestException("Invalid volcano_id: " + volcano_id);
        }
    }

}
