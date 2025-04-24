// File: FareCalculator.java
package com.rideshare.fare;

public class FareCalculator {

    public static double calculateFare(String vehicleType, double distanceInKm) {
        switch (vehicleType.toLowerCase()) {
            case "bike":
                return distanceInKm * 5;
            case "auto":
                return distanceInKm * 7;
            case "mini":
                return distanceInKm * 10;
            case "sedan":
                return distanceInKm * 12;
            case "suv":
                return distanceInKm * 15;
            case "luxury":
                return distanceInKm * 25;
            case "electric":
                return distanceInKm * 8;
            default:
                throw new IllegalArgumentException("Unknown vehicle type: " + vehicleType);
        }
    }
}
