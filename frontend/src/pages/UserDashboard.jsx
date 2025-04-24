import { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [rides, setRides] = useState([]);
  const [rideForm, setRideForm] = useState({
    origin: '',
    destination: '',
    vehicleType: 'Sedan'
  });

  // 🔹 Load user from localStorage
useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchRides(parsedUser.id);
    } catch (error) {
      console.error("Failed to parse user data:", error);
    }
  }
}, []);


  // 🔹 Fetch only that user's rides
  const fetchRides = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:8080/rides/user/${userId}`);
      setRides(res.data);
    } catch (err) {
      console.error("Failed to fetch rides:", err);
    }
  };

  // 🔹 Handle form inputs
  const handleInputChange = (e) => {
    setRideForm({ ...rideForm, [e.target.name]: e.target.value });
  };

  // 🔹 Ride request logic with validation
  // 🔄 Replace requestRide with the updated version
  const requestRide = async () => {
    if (!user) {
      alert("User not loaded yet!");
      return;
    }

    const { origin, destination, vehicleType } = rideForm;

    if (!origin || !destination || origin === destination) {
      alert("Please select valid and different origin and destination.");
      return;
    }

    try {
      await axios.post(`http://localhost:8080/rides/user/${user.id}`, {
        origin,
        destination,
        vehicleType
      });
      alert("Ride Requested Successfully");
      fetchRides(user.id); // refresh list
    } catch (err) {
      alert("Error requesting ride");
      console.error(err);
    }
  };

  const locations = [
    "Koramangala", "BTM Layout", "Whitefield", "Indiranagar", "Jayanagar",
    "Electronic City", "Marathahalli", "Malleshwaram", "Hebbal", "Yelahanka",
    "Rajajinagar", "Banashankari", "MG Road", "HSR Layout", "KR Puram",
    "Basavanagudi", "Vijayanagar", "RT Nagar", "Ulsoor", "Kengeri"
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Welcome!</h2>

      {/* 🚕 Ride Form */}
      <div className="mb-6 space-y-2">
        <select name="origin" value={rideForm.origin}
          onChange={handleInputChange} className="border p-2 w-full">
          <option value="">Select Origin</option>
          {locations.map((loc, i) => <option key={i} value={loc}>{loc}</option>)}
        </select>

        <select name="destination" value={rideForm.destination}
          onChange={handleInputChange} className="border p-2 w-full">
          <option value="">Select Destination</option>
          {locations.map((loc, i) => <option key={i} value={loc}>{loc}</option>)}
        </select>

        <select name="vehicleType" value={rideForm.vehicleType}
          onChange={handleInputChange} className="border p-2 w-full">
          <option value="Sedan">Sedan</option>
          <option value="Bike">Bike</option>
          <option value="SUV">SUV</option>
          <option value="Auto">Auto</option>
        </select>

        <button onClick={requestRide}
          className="bg-green-600 text-white px-4 py-2 rounded">
          Request Ride
        </button>
      </div>

      {/* 🧾 Past Rides */}
      <h3 className="text-xl font-semibold mb-2">Your Rides</h3>
      {rides.length > 0 ? (
        <ul className="space-y-2">
          {rides.map(ride => (
            <li key={ride.id} className="p-3 border rounded bg-gray-50">
              <strong>{ride.origin}</strong> ➡️ <strong>{ride.destination}</strong><br />
              Vehicle: {ride.vehicleType} | Fare: ₹{ride.fare} | Status: {ride.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>No rides found.</p>
      )}
    </div>
  );
}
