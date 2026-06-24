package com.fitness.gateway;

import lombok.Data;

@Data
public class RegisterResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String password;
    private Boolean isAccountVerified;
}
