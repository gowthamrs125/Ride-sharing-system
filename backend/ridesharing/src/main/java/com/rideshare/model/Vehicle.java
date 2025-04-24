package com.rideshare.model;

import jakarta.persistence.*;

@Entity
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // "Sedan", "SUV", etc.

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private User driver;

    // Constructors
    public Vehicle() {}

    public Vehicle(String type, User driver) {
        this.type = type;
        this.driver = driver;
    }

    // Getters and Setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }

    public void setType(String type) { this.type = type; }

    public User getDriver() { return driver; }

    public void setDriver(User driver) { this.driver = driver; }
}
