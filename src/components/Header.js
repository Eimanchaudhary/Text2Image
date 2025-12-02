import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">
          <span className="logo-gradient">Prompt2Pixel</span>
        </h1>
        <p className="tagline">Transform your imagination into stunning visuals</p>
      </div>
    </header>
  );
};

export default Header;