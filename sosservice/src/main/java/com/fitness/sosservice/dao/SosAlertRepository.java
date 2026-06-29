package com.fitness.sosservice.dao;

// SosAlertRepository.java
import com.fitness.sosservice.entity.SosAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SosAlertRepository extends JpaRepository<SosAlert, Long> {
    List<SosAlert> findByUserIdOrderByCreatedAtDesc(String userId);
}