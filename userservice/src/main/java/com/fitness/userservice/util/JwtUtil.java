package com.fitness.userservice.util;

import com.fitness.userservice.model.User;
import com.fitness.userservice.repository.AccountRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class JwtUtil {

    @Value("${jwt.secret.key}")
    private String SECRET_KEY;

    private SecretKey signingKey;


    private final AccountRepository accountRepository;

    @PostConstruct
    public void init() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(UserDetails userDetails) {

        User user = accountRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String userId = user.getUserId();

        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("email", userDetails.getUsername());

        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(signingKey)
                .compact();
    }

    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(extractAllClaims(token));
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            Claims claims = extractAllClaims(token);

            return claims.getSubject().equals(userDetails.getUsername())
                    && claims.getExpiration().after(new Date());

        } catch (ExpiredJwtException e) {
            return false;
        }
    }
}
