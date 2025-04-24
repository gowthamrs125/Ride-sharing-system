import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DriverDashboard() {
  const [driverName, setDriverName] = useState('');
  const [pendingRides, setPendingRides] = useState([]);
  const [myRides, setMyRides] = useState([]);

  const driverId = localStorage.getItem('driverId');

  useEffect(() => {
    setDriverName(localStorage.getItem('driverName'));

    // Fetch unassigned rides
    axios.get('http://localhost:8080/rides/unassigned')
      .then(res => setPendingRides(res.data))
      .catch(err => console.error('Failed to load rides', err));

    // Fetch driver's own rides
    axios.get(`http://localhost:8080/rides/driver/${driverId}`)
      .then(res => setMyRides(res.data))
      .catch(err => console.error('Failed to load my rides', err));
  }, []);

  const handleAcceptRide = (rideId) => {
    axios.post(`http://localhost:8080/rides/${rideId}/assign/${driverId}`)
      .then(() => {
        alert('Ride accepted!');
        // Refresh both lists
        return Promise.all([
          axios.get('http://localhost:8080/rides/unassigned'),
          axios.get(`http://localhost:8080/rides/driver/${driverId}`)
        ]);
      })
      .then(([unassignedRes, myRidesRes]) => {
        setPendingRides(unassignedRes.data);
        setMyRides(myRidesRes.data);
      })
      .catch(err => {
        console.error('Failed to accept ride', err);
        alert('Error accepting ride');
      });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Welcome, Driver {driverName}!</h2>

      <h3 className="text-xl font-semibold mb-3">Available Rides</h3>
      {pendingRides.length > 0 ? (
        <ul className="space-y-3 mb-6">
          {pendingRides.map(ride => (
            <li key={ride.id} className="p-4 border rounded bg-gray-100">
              <div><strong>{ride.origin}</strong> ➡️ <strong>{ride.destination}</strong></div>
              <div>Vehicle: {ride.vehicleType}</div>
              <button
                onClick={() => handleAcceptRide(ride.id)}
                className="mt-2 bg-green-600 text-white py-1 px-3 rounded"
              >
                Accept Ride
              </button>
            </li>
          ))}
        </ul>
      ) : <p>No available rides right now.</p>}

      <h3 className="text-xl font-semibold mb-3">Your Rides</h3>
      {myRides.length > 0 ? (
        <ul className="space-y-3">
          {myRides.map(ride => (
            <li key={ride.id} className="p-4 border rounded bg-blue-50">
              <strong>{ride.origin}</strong> ➡️ <strong>{ride.destination}</strong><br />
              Vehicle: {ride.vehicleType} | Fare: ₹{ride.fare} | Status: {ride.status}
            </li>
          ))}
        </ul>
      ) : <p>No rides assigned to you yet.</p>}
    </div>
  );
}
