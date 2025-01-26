import React, { useState } from 'react';
import './App.css';
import AdminPage from './AdminPage/Page';
import HomePage from './HomePage/HomePage';
import Header from './HomePage/components/Header';

function App() {


  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.className = !isDarkMode ? 'dark-mode' : 'light-mode'; 
  };

  return (
    <div className="App">
      <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />  {/* Transferring the function to Header */}
      <HomePage />
      <AdminPage>  
      </AdminPage>
    </div>
  );
}

export default App;