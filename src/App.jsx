import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PasswordReset from './components/Auth/PasswordReset';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import Login from './components/Auth/Login';


function App() {
  return (
      <Router>
        <div className="App">
        <Toaster />
          <main>
            <Routes>
              <Route  path="/" element={<Login/>} />
              <Route  path="/dashboard" element={<Dashboard/>} />
              <Route  path="/forgot-password" element={<PasswordReset/>} />
            </Routes>
          </main>
        </div>
      </Router>
  );
}

export default App;
