import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Signup } from './components/Signup/Signup';

function App() {
console.log(import.meta.env.VITE_USER_ACCESS_TOKEN);
console.log(import.meta.env.VITE_PAGE_ACCESS_TOKEN);
console.log(import.meta.env.VITE_PAGE_ID);
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/connectfb" element={<ConnectFB />} />
          <Route path="/page-integration/:pid" element={<DeleteDisconnect />} />
          <Route path="/agent" element={<AgentScreen />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
