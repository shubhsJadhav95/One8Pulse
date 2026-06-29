package com.fitness.sosservice.dto;

import lombok.Data;

@Data
public class SosTriggerRequest {
    private String userId;
    private double latitude;
    private double longitude;


    private String locationUrl;   // optional Google Maps link from frontend
}