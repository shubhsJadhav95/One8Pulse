package com.fitness.userservice.dto;


import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequestDTO {

    private String email;
    private String password;
}
