package com.fitness.userservice.service;


import com.fitness.userservice.dto.RegisterRequestDTO;
import com.fitness.userservice.dto.RegisterResponseDTO;
import jakarta.validation.Valid;

public interface IAccountService {
    RegisterResponseDTO createAccount(@Valid RegisterRequestDTO registerRequestDTO);

    RegisterResponseDTO getProfile(String email);

    void sendRestOtp(String email);
    void resetPassword(String email,String otp,String newPassword);

    void sendOtp(String email);

    void verifyOtp(String email,String otp);

    String getLoggedInUserId(String email);

    Boolean existsByUserId(String userId);
}



