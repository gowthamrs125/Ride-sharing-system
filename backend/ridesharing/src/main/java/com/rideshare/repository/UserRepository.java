package com.rideshare.repository;

import com.rideshare.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByPhone(String phone);
    Optional<User> findByName(String name);
    Optional<User> findByPhoneAndPassword(String phone, String password);
    Optional<User> findByNameAndPassword(String name, String password);
    Optional<User> findByNameOrPhone(String name, String phone);

}
