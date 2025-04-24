// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const vehicleTypes = ['Sedan', 'SUV', 'Bike', 'Auto', 'Mini', 'Luxury', 'Electric'];

  const handleVehicleChange = (vehicle) => {
    if (selectedVehicles.includes(vehicle)) {
      setSelectedVehicles(selectedVehicles.filter(v => v !== vehicle));
    } else {
      setSelectedVehicles([...selectedVehicles, vehicle]);
    }
  };

  const validate = () => {
    const errors = {};
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      errors.name = "Name must contain only letters and spaces.";
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      errors.phone = "Phone must start with 6/7/8/9 and be exactly 10 digits.";
    }
    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    if (role === 'DRIVER' && selectedVehicles.length === 0) {
      errors.vehicles = "Please select at least one vehicle.";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      name,
      phone,
      password,
      role,
      vehicles: role === 'DRIVER' ? selectedVehicles : []
    };

    try {
      await axios.post('http://localhost:8080/api/auth/register', data);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-700">Register</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}

        <input
          type="text"
          placeholder="Phone"
          className="w-full p-2 border rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}

        <select
          className="w-full p-2 border rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="USER">User</option>
          <option value="DRIVER">Driver</option>
        </select>

        {role === 'DRIVER' && (
          <div className="flex-wrap">
            {vehicleTypes.map(vehicle => (
              <label key={vehicle}>
                <input
                  type="checkbox"
                  checked={selectedVehicles.includes(vehicle)}
                  onChange={() => handleVehicleChange(vehicle)}
                />
                {vehicle}
              </label>
            ))}
            {errors.vehicles && <p className="text-red-600 text-sm">{errors.vehicles}</p>}
          </div>
        )}

        <button className="bg-green-600 text-white py-2 px-4 rounded w-full hover:bg-green-700">
          Register
        </button>
      </form>
    </div>
  );
}
