package com.fitness.sosservice.dto;


import lombok.Data;

@Data
public class HospitalDto {
    private String name;
    private String address;
    private double latitude;
    private double longitude;

    private double distanceKm;
    private String googleMapsUrl;
}