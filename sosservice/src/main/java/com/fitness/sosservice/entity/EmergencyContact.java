package com.fitness.sosservice.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "emergency_contacts")
@Data
public class EmergencyContact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userId;          // FK to your User entity

    @Column(nullable = false)
    private String contactName;

    @Column(nullable = false)
    private String contactEmail;

    @Column
    private String contactPhone;


}