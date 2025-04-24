package com.rideshare.repository;

import com.rideshare.model.Ride;
import com.rideshare.model.RideStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByOrigin(String origin);
    List<Ride> findByDestination(String destination);
    List<Ride> findByUserId(Long userId);
    List<Ride> findByStatus(RideStatus status);
    List<Ride> findByStatus(String status);
    List<Ride> findByDriverIsNullAndStatus(RideStatus status);
    List<Ride> findByDriverId(Long driverId);
}
