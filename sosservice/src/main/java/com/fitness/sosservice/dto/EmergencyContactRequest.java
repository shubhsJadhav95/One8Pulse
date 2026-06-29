package com.fitness.sosservice.dto;


import lombok.Data;

@Data
public class EmergencyContactRequest {
    private String userId;
    private String contactName;
    private String contactEmail;
    private String contactPhone;
}
