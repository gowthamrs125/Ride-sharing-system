package com.rideshare.controller;

import com.rideshare.model.Ride;
import com.rideshare.model.RideStatus;
import com.rideshare.model.User;
import com.rideshare.repository.UserRepository;
import com.rideshare.service.RideService;
import com.rideshare.repository.RideRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rides")
public class RideController {

    @Autowired
    private RideRepository rideRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private RideService rideService;

    @GetMapping
    public List<Ride> getAllRides() {
        return rideRepo.findAll();
    }



    @GetMapping("/{id}")
    public ResponseEntity<Ride> getRideById(@PathVariable Long id) {
        Optional<Ride> ride = rideRepo.findById(id);
        return ride.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ride> updateRide(@PathVariable Long id, @RequestBody Ride newRideData) {
        Optional<Ride> optionalRide = rideRepo.findById(id);
    
        if (optionalRide.isPresent()) {
            Ride ride = optionalRide.get();
    
            // Only update fields if they are not null in the incoming request
            if (newRideData.getOrigin() != null) {
                ride.setOrigin(newRideData.getOrigin());
            }
    
            if (newRideData.getDestination() != null) {
                ride.setDestination(newRideData.getDestination());
            }
    
            if (newRideData.getStatus() != null) {
                ride.setStatus(newRideData.getStatus());
            }
    
            // Always update the timestamp
            ride.setUpdatedAt(LocalDateTime.now());
    
            return ResponseEntity.ok(rideRepo.save(ride));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Ride> updateRideStatus(@PathVariable Long id, @RequestBody Ride updatedRide) {
        Optional<Ride> optionalRide = rideRepo.findById(id);

        if (optionalRide.isPresent()) {
            Ride ride = optionalRide.get();
            ride.setStatus(updatedRide.getStatus());
            ride.setUpdatedAt(LocalDateTime.now());
            return ResponseEntity.ok(rideRepo.save(ride));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRide(@PathVariable Long id) {
        if (rideRepo.existsById(id)) {
            rideRepo.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // @PostMapping("/user/{userId}")
    // public Ride createRideForUser(@PathVariable Long userId, @RequestBody Ride rideDetails) {
    //     User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    //     rideDetails.setUser(user);
    //     rideDetails.setCreatedAt(LocalDateTime.now());
    //     rideDetails.setUpdatedAt(LocalDateTime.now());
    //     rideDetails.setStatus(RideStatus.PENDING); // enum
    //     return rideRepo.save(rideDetails);
    // }


    @PostMapping("/user/{userId}")
    public Ride createRideForUser(@PathVariable Long userId, @RequestBody Ride rideDetails) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    
        rideDetails.setUser(user);
        rideDetails.setCreatedAt(LocalDateTime.now());
        rideDetails.setUpdatedAt(LocalDateTime.now());
        rideDetails.setStatus(RideStatus.PENDING);
    
        // ✅ MOCKING: Fixed distance based on origin and destination
        double distanceInKm = calculateDistance(rideDetails.getOrigin(), rideDetails.getDestination());
        rideDetails.setDistanceInKm(distanceInKm);
    
        // ✅ MOCKING: fare calculation
        double farePerKm = switch (rideDetails.getVehicleType().toLowerCase()) {
            case "sedan" -> 12;
            case "suv" -> 15;
            case "bike" -> 5;
            case "auto" -> 8;
            case "mini" -> 10;
            case "luxury" -> 25;
            case "electric" -> 9;
            default -> 10;
        };
    
        rideDetails.setFare(distanceInKm * farePerKm);
    
        return rideRepo.save(rideDetails);
    }
    
    // 🧠 Simple distance calculator (returns 5km if locations are different, else 0)
    private double calculateDistance(String origin, String destination) {
        if (origin.equalsIgnoreCase(destination)) {
            return 0.0;
        }
        return 5.0;
    }
    
    
    
    @GetMapping("/origin/{origin}")
    public List<Ride> getRidesByOrigin(@PathVariable String origin) {
        return rideService.getRidesByOrigin(origin);
    }

    @GetMapping("/destination/{destination}")
    public List<Ride> getRidesByDestination(@PathVariable String destination) {
        return rideService.getRidesByDestination(destination);
    }

    @GetMapping("/user/{userId}")
    public List<Ride> getRidesByUserId(@PathVariable Long userId) {
        return rideService.getRidesByUserId(userId);
    }

    @GetMapping("/available")
    public List<Ride> getAvailableRides() {
        return rideRepo.findByStatus(RideStatus.PENDING);
    }
    
    @PutMapping("/accept/{rideId}")
    public String acceptRide(@PathVariable Long rideId, @RequestParam Long driverId) {
    Optional<Ride> rideOpt = rideRepo.findById(rideId);
    Optional<User> driverOpt = userRepo.findById(driverId);

        if (rideOpt.isPresent() && driverOpt.isPresent()) {
            Ride ride = rideOpt.get();
            User driver = driverOpt.get();

            ride.setDriver(driver);
            ride.setStatus(RideStatus.ONGOING); // ✅ Use enum, not string
            ride.setUpdatedAt(LocalDateTime.now());
            rideRepo.save(ride);

            return "Ride accepted by driver.";
        }

        return "Ride or driver not found.";
    }

    @GetMapping("/unassigned")
    public List<Ride> getUnassignedRides() {
        return rideRepo.findByDriverIsNullAndStatus(RideStatus.PENDING);
    }

    @GetMapping("/driver/{driverId}")
    public List<Ride> getRidesForDriver(@PathVariable Long driverId) {
        return rideRepo.findByDriverId(driverId);
    }

    @PostMapping("/{rideId}/assign/{driverId}")
    public Ride assignDriver(@PathVariable Long rideId, @PathVariable Long driverId) {
        Ride ride = rideRepo.findById(rideId)
            .orElseThrow(() -> new RuntimeException("Ride not found"));
        User driver = userRepo.findById(driverId)
            .orElseThrow(() -> new RuntimeException("Driver not found"));
    
        ride.setDriver(driver);
        ride.setStatus(RideStatus.ONGOING); // You can use ASSIGNED if needed
        ride.setUpdatedAt(LocalDateTime.now());
        return rideRepo.save(ride);
    }
    
    @PutMapping("/complete/{rideId}")
    public ResponseEntity<Ride> completeRide(@PathVariable Long rideId) {
    Optional<Ride> optionalRide = rideRepo.findById(rideId);
    
    if (optionalRide.isPresent()) {
        Ride ride = optionalRide.get();
        ride.setStatus(RideStatus.COMPLETED);
        ride.setCompletedAt(LocalDateTime.now());

        // Mocking fare calculation: e.g., ₹10/km * 12 km = ₹120
        ride.setFare(120.0);
        ride.setPaymentStatus("PAID");

        ride.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(rideRepo.save(ride));
    } else {
        return ResponseEntity.notFound().build();
        }
    }


        
    
}
