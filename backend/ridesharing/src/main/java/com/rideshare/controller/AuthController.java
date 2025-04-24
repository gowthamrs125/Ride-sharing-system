package com.rideshare.controller;

import com.rideshare.model.User;
import com.rideshare.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        Optional<User> existing = userService.getByPhone(user.getPhone());
        if (existing.isPresent()) {
            return "User already registered with this phone number.";
        }

        userService.registerUser(user);
        return "Registration successful. Please login.";
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String loginField, @RequestParam String password) {
        if (!isValidLoginField(loginField)) {
            return ResponseEntity.badRequest().body("Enter a valid name or phone number.");
        }
    
        Optional<User> userOptional = userService.getByNameOrPhone(loginField);
    
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getPassword().equals(password)) {
                return ResponseEntity.ok(user);
            }
        }
    
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid name or password");
    }
    
    private boolean isValidLoginField(String loginField) {
        // If it's a phone number
        if (loginField.matches("^[6-9]\\d{9}$")) {
            return true;
        }
        // If it's a name (only letters, no digits or special chars)
        return loginField.matches("^[A-Za-z]+$");
    }
    
    
    
}
