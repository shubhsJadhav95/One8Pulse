package com.fitness.userservice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequestDTO {



    @Schema(
            description = "Name of the customer",
            example = "Eazy Bytes",
            minLength = 5,
            maxLength = 30,
            required = true
    )
    @NotEmpty(message = "Name can not be null or empty")
    @Size(min = 5, max = 30, message = "The length of the customer name should be between 5 and 30")
    private String name;

    @Schema(
            description = "Email address of the customer",
            example = "shubhs@gmail.com",
            required = true
    )
    @NotEmpty(message = "Email address can not be null or empty")
    @Email(message = "Email address should be a valid value")
    private String email;

    @Schema(
            description = "Password for the account",
            example = "StrongP@ss123"
    )
    private String password;


}
