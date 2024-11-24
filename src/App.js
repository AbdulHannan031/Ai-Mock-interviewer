import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { message, Spin } from 'antd'; // Import Antd message and Spin
import 'antd/dist/reset.css'; // Import Antd CSS reset
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import './index.css';
import { useLocalContext } from './context/context';
import TestScreen from './components/TestScreen';
import ResultScreen from './components/ResultScreen';
// Not Found Component with Immediate Redirection
function NotFound() {
  const navigate = useNavigate(); // Use useNavigate for immediate redirect
  const location = useLocation();

  useEffect(() => {
    navigate('/', { replace: true }); // Redirect to login immediately
  }, [navigate, location]);

  return null; // No need to render anything
}

function App() {
  const { user } = useLocalContext();
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    // Simulate loading time for demonstration (you can replace this with actual loading logic)
    const timer = setTimeout(() => {
      setLoading(false); // Hide loader after loading is done
    }, 1000); // 1 second loading time (adjust as needed)

    return () => clearTimeout(timer); // Cleanup timeout
  }, []);

  // Show loader while loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {user ? (
          <Route path="/" element={<Dashboard />} />
        ) : (
          <>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </>
        )}
        {/* Handle all unmatched routes */}
        <Route path="/*" element={<NotFound />} />
        <Route path='/test' element={<TestScreen/>}/>
        <Route path='/result' element={<ResultScreen/>}/>
      </Routes>
    </Router>
  );
}

export default App;
