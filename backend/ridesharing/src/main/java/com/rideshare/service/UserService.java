package com.rideshare.service;

import com.rideshare.model.User;

import com.rideshare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> login(String nameOrPhone, String password) {
        Optional<User> byPhone = userRepository.findByPhoneAndPassword(nameOrPhone, password);
        if (byPhone.isPresent()) return byPhone;

        return userRepository.findByNameAndPassword(nameOrPhone, password);
    }

    public Optional<User> getByPhone(String phone) {
        return userRepository.findByPhone(phone);
    }

    public Optional<User> getByNameOrPhone(String loginField) {
        return userRepository.findByNameOrPhone(loginField, loginField);
    }
}
