package com.rideshare.service;

import com.rideshare.fare.FareCalculator;  // Import the FareCalculator class
import com.rideshare.model.Ride;
import com.rideshare.repository.RideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RideService {

    @Autowired
    private RideRepository rideRepo;

    public List<Ride> getAllRides() {
        return rideRepo.findAll();
    }

    public Optional<Ride> getRideById(Long id) {
        return rideRepo.findById(id);
    }

    public Ride createRide(Ride ride) {
        // Calculate fare before saving the ride
        double fare = FareCalculator.calculateFare(ride.getVehicleType(), ride.getDistanceInKm());
        ride.setFare(fare);

        // Save and return the created ride
        return rideRepo.save(ride);
    }

    public Ride updateRide(Long id, Ride updatedRide) {
        return rideRepo.findById(id).map(ride -> {
            // Update fields
            ride.setOrigin(updatedRide.getOrigin());
            ride.setDestination(updatedRide.getDestination());
            ride.setUser(updatedRide.getUser());
            
            // Calculate fare if distance or vehicle type changes
            if (updatedRide.getVehicleType() != null && updatedRide.getDistanceInKm() != 0) {
                double fare = FareCalculator.calculateFare(updatedRide.getVehicleType(), updatedRide.getDistanceInKm());
                ride.setFare(fare);
            }

            return rideRepo.save(ride);
        }).orElse(null);
    }

    public void deleteRide(Long id) {
        rideRepo.deleteById(id);
    }

    public List<Ride> getRidesByOrigin(String origin) {
        return rideRepo.findByOrigin(origin);
    }

    public List<Ride> getRidesByDestination(String destination) {
        return rideRepo.findByDestination(destination);
    }

    public List<Ride> getRidesByUserId(Long userId) {
        return rideRepo.findByUserId(userId);
    }
}
