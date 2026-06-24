package com.fitness.userservice.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class RegisterResponseDTO {

    @Schema(
            description = "Status message in the response"
    )
    private String message;

    private Long id;
    private String userId;
    private String name;
    private String email;
    private String password;
    private Boolean isAccountVerified;


}
