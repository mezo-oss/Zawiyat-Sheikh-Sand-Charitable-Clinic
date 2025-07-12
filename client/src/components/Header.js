import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <Heart size={32} />
          <span>Elite Medical Center</span>
        </Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/booking">Book Appointment</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;