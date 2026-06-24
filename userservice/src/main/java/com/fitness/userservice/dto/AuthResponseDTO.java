package com.fitness.userservice.dto;


import lombok.*;

@Data
@AllArgsConstructor
public class AuthResponseDTO {

    private String email;
    private String token;
}
