package ies.vamsbackend.exceptions;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ErrorResponse {

    private int status;
    private String message;
    private LocalDateTime timestamp;
    private String details;

    public ErrorResponse(int status, String message, String details) {
        this.status = status;
        this.message = message;
        this.timestamp = LocalDateTime.now();
        this.details = details;
    }

}
