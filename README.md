🚗 Ride Sharing System

A full-stack Ride Sharing Web Application inspired by platforms like Uber/Ola, built using Spring Boot (Backend), React (Frontend), and MySQL (Database).
The system supports User and Driver roles, ride creation, ride assignment, fare calculation, and ride lifecycle management.

✨ Features
👤 User Features

User registration & login (name or phone + password)

Request a ride by selecting:

Origin (Bengaluru locations)

Destination

Vehicle type (Sedan, Bike, SUV, Auto)

Automatic fare calculation (backend)

View only their own rides

Track ride status:

PENDING → ONGOING → COMPLETED

🚕 Driver Features

Driver registration & login

View unassigned rides

Accept available rides

View assigned rides

Complete rides

💰 Fare Logic

Distance between any two locations is mocked as 5 km

Fare calculated in backend based on vehicle type:

Vehicle	Rate (₹/km)
Bike	5
Auto	8
Sedan	12
SUV	15
🧱 Tech Stack
Backend

Java

Spring Boot

Spring Data JPA

REST APIs

MySQL

Hibernate

Frontend

React (Vite)

Axios

React Router

CSS (custom + utility classes)

Tools

Git & GitHub

VS Code

Postman (initial testing)

🗂️ Project Structure
Backend (ride-sharing-system-backend)
com.rideshare
 ┣ controller
 ┃ ┣ AuthController.java
 ┃ ┗ RideController.java
 ┣ model
 ┃ ┣ Ride.java
 ┃ ┣ User.java
 ┃ ┣ Vehicle.java
 ┃ ┣ RideStatus.java
 ┃ ┗ UserRole.java
 ┣ repository
 ┃ ┣ RideRepository.java
 ┃ ┗ UserRepository.java
 ┣ service
 ┃ ┣ RideService.java
 ┃ ┗ UserService.java
 ┗ RideSharingApplication.java

Frontend (ride-sharing-system-frontend)
src
 ┣ pages
 ┃ ┣ Home.jsx
 ┃ ┣ LoginPage.jsx
 ┃ ┣ RegisterPage.jsx
 ┃ ┣ UserDashboard.jsx
 ┃ ┗ DriverDashboard.jsx
 ┣ App.jsx
 ┣ index.css
 ┗ main.jsx

🏗️ Architecture Used

Layered Architecture

Controller → Service → Repository → Database

RESTful API Design

MVC Pattern (Backend)

Separation of Concerns

Single Responsibility Principle

Dependency Injection (Spring)

🔐 Authentication Logic

Login using name OR phone number

Password validation

Role-based redirection:

USER → User Dashboard

DRIVER → Driver Dashboard

🧪 How It Works (Flow)

User/Driver registers

Login using name or phone

User requests a ride

Ride stored with:

Status = PENDING

Distance = 5 km

Fare = calculated in backend

Driver accepts ride → status ONGOING

Driver completes ride → status COMPLETED

User sees updated ride status & fare

🚀 Future Enhancements

JWT authentication

Real distance calculation (Google Maps API)

Payment gateway integration

Driver vehicle management

Ride cancellation

Admin dashboard

Deployment (AWS / Docker)
