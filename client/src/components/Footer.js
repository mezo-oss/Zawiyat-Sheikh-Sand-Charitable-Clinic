import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Elite Medical Center</h3>
          <p>Excellence in Healthcare</p>
          <p>Your trusted partner for world-class medical care with personalized attention.</p>
        </div>
        <div className="footer-section">
          <h3>Contact Information</h3>
          <p>📞 +1 (555) 123-4567</p>
          <p>✉️ appointments@elitemedical.com</p>
          <p>📍 123 Medical Plaza, Health City, HC 12345</p>
        </div>
        <div className="footer-section">
          <h3>Services</h3>
          <a href="#cardiology">Cardiology</a>
          <a href="#orthopedics">Orthopedics</a>
          <a href="#dermatology">Dermatology</a>
          <a href="#neurology">Neurology</a>
          <a href="#pediatrics">Pediatrics</a>
        </div>
        <div className="footer-section">
          <h3>Hospital Hours</h3>
          <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
          <p>Saturday: 9:00 AM - 4:00 PM</p>
          <p>Sunday: Emergency Services Only</p>
          <p>24/7 Emergency Care Available</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Elite Medical Center. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;