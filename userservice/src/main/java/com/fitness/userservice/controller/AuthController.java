package com.fitness.userservice.controller;


import com.fitness.userservice.dto.AuthRequestDTO;
import com.fitness.userservice.dto.ResetPasswordRequest;
import com.fitness.userservice.service.impl.AccountServiceImpl;
import com.fitness.userservice.service.impl.UserDetailServiceImpl;
import com.fitness.userservice.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailServiceImpl userDetailService;
    private final JwtUtil jwtUtil;

    private final AccountServiceImpl accountService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AuthRequestDTO authRequestDTO) {
        Map<String, Object> responseMap = new HashMap<>();

        authenticate(authRequestDTO.getEmail(), authRequestDTO.getPassword());

        UserDetails userDetails =
                userDetailService.loadUserByUsername(authRequestDTO.getEmail());

        String jwtToken = jwtUtil.generateToken(userDetails);

        responseMap.put("email", authRequestDTO.getEmail());
        responseMap.put("token", jwtToken);

        ResponseCookie cookie = ResponseCookie.from("jwt", jwtToken)
                .httpOnly(true)
                .path("/")
                .maxAge(Duration.ofDays(1))
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(responseMap);
    }

    private void authenticate(String email, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
    }

    @GetMapping("is-authenticated")
    public ResponseEntity<Boolean> isAuthenticated(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        return ResponseEntity.ok(email != null);
    }

    @PostMapping("send-reset-otp")
    public void sendResetOtp(@RequestParam String email) {
        try {
            accountService.sendRestOtp(email);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
        }
    }

    @PostMapping("reset-password")
    public void reserPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            accountService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
        }
    }

    @PostMapping("send-otp")
    public void sendOtpToVerfied(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        try {
            accountService.sendOtp(email);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
        }
    }

    @PostMapping("verify-otp")
    public void verifyOtp(@RequestBody Map<String, Object> request, @CurrentSecurityContext(expression = "authentication?.name") String email) {
        try {
            accountService.verifyOtp(email, request.get("otp").toString());
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
        }

    }

    @PostMapping("logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false) //make it true in producation
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE,cookie.toString())
                .body("Logged out sucessfully !");
    }

    @GetMapping("/{userId}/validate")
    public ResponseEntity<Boolean> validateUser(@PathVariable String userId){
        return ResponseEntity.ok(accountService.existsByUserId(userId));
    }

}




