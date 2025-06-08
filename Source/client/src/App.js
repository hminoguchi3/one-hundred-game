import logo from './kishi.png';
import './App.css';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import HomePage from './pages/HomePage'; // Example home page

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello Mizuki!
        </p>
        <HomePage />
      </header>
    </div >);
}

export default App; 
