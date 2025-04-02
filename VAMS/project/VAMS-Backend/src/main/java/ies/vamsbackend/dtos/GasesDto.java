package ies.vamsbackend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GasesDto {

    private List<GasEntry> entries = new ArrayList<>();

    public void addEntry(GasEntry entry) {
        entries.add(entry);
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GasEntry {
        private LocalDateTime timestamp;
        private Double H2S;
        private Double CO2;
        private Double SO2;
        private Double HCl;

        public GasEntry(LocalDateTime timestamp) {
            this.timestamp = timestamp;
        }
    }

}
