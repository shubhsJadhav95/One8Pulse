package com.fitness.userservice.repository;

import com.fitness.userservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<User,Long> {

    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String Email);

    Boolean existsByUserId(String userId);
}
