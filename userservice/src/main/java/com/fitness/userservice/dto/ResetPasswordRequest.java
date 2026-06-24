package com.fitness.userservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResetPasswordRequest {

    @NotBlank(message = "OTP is required")
    private String otp;

    @NotBlank(message = "email is required")
    private  String email;

    @NotBlank(message = "New Password is required")
    private String newPassword;
}
