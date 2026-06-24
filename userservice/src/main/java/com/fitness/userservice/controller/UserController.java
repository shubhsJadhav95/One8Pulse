package com.fitness.userservice.controller;

import com.fitness.userservice.dto.ErrorResponseDto;
import com.fitness.userservice.dto.RegisterRequestDTO;
import com.fitness.userservice.dto.RegisterResponseDTO;
import com.fitness.userservice.service.IAccountService;
import com.fitness.userservice.service.impl.EmailServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;



@Slf4j
@RequestMapping("/api/users")
@Validated
@RequiredArgsConstructor
@RestController
public class UserController {

    @Autowired
    private IAccountService iAccountService;

    @Autowired
    private EmailServiceImpl emailService;

    @Operation(
            summary = "Create Account REST API",
            description = "REST API to create new Customer &  Account inside NeoCare"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "HTTP Status CREATED"
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "HTTP Status Internal Server Error",
                    content = @Content(
                            schema = @Schema(implementation = ErrorResponseDto.class)
                    )
            )
    }
    )
    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> createProfile(
            @Valid @RequestBody RegisterRequestDTO registerRequestDTO) {

        RegisterResponseDTO response = iAccountService.createAccount(registerRequestDTO);
        emailService.sendWelcomeEmail(response.getEmail(),response.getName());


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);

    }

    @GetMapping("/profile")
    public RegisterResponseDTO getProfile(@CurrentSecurityContext(expression = "authentication?.name")String email){

        return iAccountService.getProfile(email);
    }


}
