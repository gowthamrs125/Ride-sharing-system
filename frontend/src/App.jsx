import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/UserDashboard';
import DriverDashboard from './pages/DriverDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route path="*" element={<RegisterPage />} /> {/* Default */}
      </Routes>
    </Router>
  );
}

export default App;
