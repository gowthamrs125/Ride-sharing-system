// src/pages/Home.jsx
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
      <div className="text-center bg-white p-10 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-blue-700">Welcome to RideEase!</h1>
        <p className="mb-8 text-gray-700">Fast, simple and reliable ride-sharing platform.</p>
        <div className="space-x-6">
          <button
            onClick={() => navigate('/register')}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded"
          >
            Register
          </button>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
