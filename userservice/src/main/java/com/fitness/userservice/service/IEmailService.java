package com.fitness.userservice.service;


public interface IEmailService {
    void sendWelcomeEmail(String email, String name);

    void sendOtpEmailToVerify(String toEmail,String otp);
}
