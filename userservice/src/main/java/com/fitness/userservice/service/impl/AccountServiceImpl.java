package com.fitness.userservice.service.impl;


import com.fitness.userservice.dto.RegisterRequestDTO;
import com.fitness.userservice.dto.RegisterResponseDTO;
import com.fitness.userservice.model.User;
import com.fitness.userservice.repository.AccountRepository;
import com.fitness.userservice.service.IAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements IAccountService {


    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailServiceImpl emailService;

    @Override
    public RegisterResponseDTO createAccount(RegisterRequestDTO dto) {
        User newUser = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .isAccountVerified(false)
                .userId(UUID.randomUUID().toString())
                .build();

        try {
            newUser = accountRepository.save(newUser);
            emailService.sendWelcomeEmail(newUser.getEmail(), newUser.getName());
            return convertToRegisterResponse(newUser);
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
    }

    @Override
    public RegisterResponseDTO getProfile(String email) {
        User user = accountRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        return convertToRegisterResponse(user);
    }

    @Override
    public void sendRestOtp(String email) {
        User user = accountRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        String otp = generateOtp();
        long expiryTime = System.currentTimeMillis() + (15 * 60 * 1000);

        user.setResetOtp(otp);
        user.setResetOtpExpiredAt(expiryTime);
        accountRepository.save(user);

        try {
            emailService.sendResetOtpEmail(user.getEmail(), otp);
        } catch (Exception ex) {
            throw new RuntimeException("Unable to send email");
        }
    }

    @Override
    public void resetPassword(String email, String otp, String newPassword) {
        User user = accountRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        if (user.getResetOtp() == null || !user.getResetOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }
        if (user.getResetOtpExpiredAt() < System.currentTimeMillis()) {
            throw new RuntimeException("OTP expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetOtp(null);
        user.setResetOtpExpiredAt(0L);
        accountRepository.save(user);
    }

    @Override
    public void sendOtp(String email) {
        User user = accountRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        if (Boolean.TRUE.equals(user.getIsAccountVerified())) {
            return;
        }

        String otp = generateOtp();
        long expiryTime = System.currentTimeMillis() + (24 * 60 * 60 * 1000);

        user.setVerifyOtp(otp);
        user.setVerifyOtpExpiredAt(expiryTime);
        accountRepository.save(user);

        try {
            emailService.sendOtpEmailToVerify(user.getEmail(), otp);
        } catch (Exception ex) {
            throw new RuntimeException("Unable to send email");
        }
    }

    @Override
    public void verifyOtp(String email, String otp) {
        User user = accountRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        if (user.getVerifyOtp() == null || !user.getVerifyOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }
        if (user.getVerifyOtpExpiredAt() < System.currentTimeMillis()) {
            throw new RuntimeException("OTP expired");
        }

        user.setIsAccountVerified(true);
        user.setVerifyOtp(null);
        user.setVerifyOtpExpiredAt(0L);
        accountRepository.save(user);
    }

    @Override
    public String getLoggedInUserId(String email) {
        User user = accountRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        return user.getEmail();
    }



    public Boolean existsByUserId(String userId) {
        return accountRepository.existsByUserId(userId);
    }

    private String generateOtp() {
        return String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));
    }

    private RegisterResponseDTO convertToRegisterResponse(User user) {
        return RegisterResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .isAccountVerified(user.getIsAccountVerified())
                .message("Account created successfully")
                .userId(user.getUserId())
                .build();
    }
}