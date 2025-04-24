import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
  const [loginField, setLoginField] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    const phoneRegex = /^[6-9]\d{9}$/;
    const nameRegex = /^[A-Za-z ]+$/;

    if (!loginField.trim()) {
      errors.loginField = 'Enter phone number or name.';
    } else if (!phoneRegex.test(loginField) && !nameRegex.test(loginField)) {
      errors.loginField = 'Enter a valid 10-digit phone number or a valid name.';
    }

    if (!password || password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', null, {
        params: { loginField, password }
      });

      const { id, name, role } = res.data;

      localStorage.setItem(role === 'DRIVER' ? 'driverId' : 'userId', id);
      localStorage.setItem(role === 'DRIVER' ? 'driverName' : 'userName', name);
      localStorage.setItem("user", JSON.stringify(res.data)); // ✅ fixed this line

      alert('Login successful!');

      navigate(role === 'DRIVER' ? '/driver/dashboard' : '/user/dashboard');
    } catch (err) {
      setErrors({ loginField: 'Invalid name or password', password: ' ' });
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Login</h2>

        <div>
          <input
            type="text"
            placeholder="Phone or Name"
            className="w-full p-2 border rounded"
            value={loginField}
            onChange={(e) => setLoginField(e.target.value)}
          />
          {errors.loginField && <p className="text-red-600 text-sm">{errors.loginField}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
        </div>

        <button className="bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}
