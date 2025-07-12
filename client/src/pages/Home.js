import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Shield, Users, Award, Clock, Heart, User } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const [hospitalInfo, setHospitalInfo] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hospitalResponse, doctorsResponse] = await Promise.all([
          axios.get('/api/hospital-info'),
          axios.get('/api/doctors')
        ]);
        setHospitalInfo(hospitalResponse.data);
        setDoctors(doctorsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>{hospitalInfo?.name || 'Elite Medical Center'}</h1>
          <p>{hospitalInfo?.tagline || 'Excellence in Healthcare'}</p>
          <p>{hospitalInfo?.description}</p>
          <Link to="/booking" className="cta-button">
            Book Your Appointment Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-content">
          <h2>Why Choose Elite Medical Center?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={32} />
              </div>
              <h3>World-Class Care</h3>
              <p>State-of-the-art facilities with the latest medical technology and equipment for accurate diagnosis and treatment.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Users size={32} />
              </div>
              <h3>Expert Specialists</h3>
              <p>Board-certified doctors with years of experience in their respective fields, committed to your health and well-being.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Calendar size={32} />
              </div>
              <h3>Easy Scheduling</h3>
              <p>Convenient online booking system that lets you schedule appointments at your preferred time with just a few clicks.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Award size={32} />
              </div>
              <h3>Personalized Treatment</h3>
              <p>Individualized care plans tailored to your specific needs and medical history for optimal health outcomes.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Clock size={32} />
              </div>
              <h3>24/7 Emergency Care</h3>
              <p>Round-the-clock emergency services with immediate response times for urgent medical situations.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Heart size={32} />
              </div>
              <h3>Compassionate Service</h3>
              <p>Caring and empathetic staff dedicated to making your healthcare experience comfortable and stress-free.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="doctors">
        <div className="doctors-content">
          <h2>Meet Our Specialists</h2>
          <div className="doctors-grid">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="doctor-card">
                <div className="doctor-avatar">
                  <User size={32} />
                </div>
                <h3>{doctor.name}</h3>
                <p>{doctor.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero" style={{ padding: '3rem 0' }}>
        <div className="hero-content">
          <h2>Ready to Take Care of Your Health?</h2>
          <p>Schedule your appointment today and experience the difference of personalized medical care.</p>
          <Link to="/booking" className="cta-button">
            Book Appointment
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;