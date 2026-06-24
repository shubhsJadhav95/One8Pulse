package com.fitness.userservice.service.impl;


import com.fitness.userservice.service.IEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements IEmailService {

    private final JavaMailSender mailSender;



    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;


    public void sendWelcomeEmail(String toEmail, String name) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Welcome to our platform");
        message.setText(
                "Hello " + name + ",\n\n" +
                        "Thanks for registering with us!\n\n" +
                        "Regards,\n" +
                        "NeoCare Team\n\n" +
                        "Developed by Shubham Jadhav"
        );

        mailSender.send(message);
    }

    public void sendResetOtpEmail(String toEmail,String otp)
    {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Password Reset OTP");
        message.setText(
                "Your Password for an resetting an OTP is: \n\n"
                        +otp +
                        ".\n\nUse This OTP to procced with resetting the password");

        mailSender.send(message);
    }

    public void sendOtpEmailToVerify(String toEmail,String otp)
    {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Account Verification OTP");
        message.setText(
                "Your OTP For Verification is: \n\n"
                        +otp +
                        ".\n\nVerify Your Account Using this OTP");

        mailSender.send(message);
    }
}
