import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';
import { ConnectFb } from './pages/ConnectFb';
import { DisconnectPage } from './pages/Disconnect';
import { AgentScreen } from './pages/AgentScreen';

function App() {
// console.log(import.meta.env.VITE_USER_ACCESS_TOKEN);
// console.log(import.meta.env.VITE_PAGE_ACCESS_TOKEN);
// console.log(import.meta.env.VITE_PAGE_ID);
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/connectfb" element={<ConnectFb />} />
          <Route path="/disconnect" element={<DisconnectPage />} />
          <Route path="/chat-screen" element={<AgentScreen />} /> 
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
