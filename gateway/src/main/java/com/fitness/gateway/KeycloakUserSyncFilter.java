package com.fitness.gateway;

import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
@Slf4j
public class KeycloakUserSyncFilter implements WebFilter {

    private final UserService userService;

    public KeycloakUserSyncFilter(UserService userService) {
        this.userService = userService;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        log.info("🔍 KeycloakUserSyncFilter triggered");

        // Extract headers
        String userId = exchange.getRequest().getHeaders().getFirst("X-User-ID");
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");

        if (userId != null && token != null) {
            log.info("Processing User Sync for User ID: {}", userId);

            // Use the reactive UserService calls directly
            return userService.validateUser(userId)
                    .flatMap(exists -> {
                        if (!exists) {
                            log.info("User does not exist. Fetching details from Keycloak...");
                            RegisterRequest registerRequest = getUserDetails(token);
                            if (registerRequest != null) {
                                log.info("Registering new user: {}", registerRequest.getEmail());
                                // Assume registerUser returns a reactive type (Mono<UserResponse> or Mono<Void>)
                                return userService.registerUser(registerRequest)
                                        .then(Mono.empty());
                            } else {
                                log.error("Failed to extract user details from token. Registration aborted.");
                                return Mono.empty();
                            }
                        } else {
                            log.info("User already exists. Skipping sync.");
                            return Mono.empty();
                        }
                    })
                    // Mutate the request to explicitly set the header before continuing the chain.
                    .then(Mono.defer(() -> {
                        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                                .header("X-User-ID", userId)
                                .build();
                        return chain.filter(exchange.mutate().request(mutatedRequest).build());
                    }));  // Continue the filter chain after processing
        }
        // If userId or token is missing, simply continue the filter chain
        return chain.filter(exchange);
    }

    private RegisterRequest getUserDetails(String token) {
        try {
            String tokenWithoutBearer = token.replace("Bearer ", "").trim();
            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            RegisterRequest registerRequest = new RegisterRequest();
            registerRequest.setEmail(claims.getStringClaim("email"));
            registerRequest.setKeycloakId(claims.getStringClaim("sub"));
            registerRequest.setPassword("dummy@123");
            registerRequest.setFirstName(claims.getStringClaim("given_name"));
            registerRequest.setLastName(claims.getStringClaim("family_name"));

            log.info("Extracted user details: {}", registerRequest);
            return registerRequest;
        } catch (Exception e) {
            log.error("Error parsing JWT token", e);
            return null;
        }
    }
}
