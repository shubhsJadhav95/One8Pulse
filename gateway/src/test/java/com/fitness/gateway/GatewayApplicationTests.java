package com.fitness.gateway;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "jwt.secret.key=nM3GZ9YxE0rXv1R8Pp2Z5cQ4A6v0m9FZkZ0YpZyM3vA=",
    "spring.config.import=optional:configserver:http://localhost:8888"
})
class GatewayApplicationTests {

	@Test
	void contextLoads() {
	}

}
