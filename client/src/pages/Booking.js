import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Booking = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    doctorId: '',
    reason: ''
  });
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('/api/doctors');
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast.error('Failed to load doctors');
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    if (formData.date && formData.doctorId) {
      fetchAvailableSlots();
    }
  }, [formData.date, formData.doctorId]);

  const fetchAvailableSlots = async () => {
    setSlotsLoading(true);
    try {
      const response = await axios.get('/api/available-slots', {
        params: { date: formData.date, doctorId: formData.doctorId }
      });
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      toast.error('Failed to load available time slots');
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTimeSlotSelect = (time) => {
    setFormData(prev => ({
      ...prev,
      time: time
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/appointments', formData);
      toast.success('Appointment booked successfully!');
      navigate(`/confirmation/${response.data.appointment.id}`);
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error(error.response?.data?.error || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.patientName && 
           formData.email && 
           formData.phone && 
           formData.date && 
           formData.time && 
           formData.doctorId && 
           formData.reason;
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-form">
          <h2>Book Your Appointment</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="patientName">Full Name *</label>
              <input
                type="text"
                id="patientName"
                name="patientName"
                value={formData.patientName}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="doctorId">Select Doctor *</label>
              <select
                id="doctorId"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleInputChange}
                required
              >
                <option value="">Choose a doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Preferred Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                min={getTomorrowDate()}
                max={getMaxDate()}
              />
            </div>

            {formData.date && formData.doctorId && (
              <div className="form-group">
                <label>Available Time Slots *</label>
                {slotsLoading ? (
                  <div className="loading">
                    <div className="loading-spinner"></div>
                  </div>
                ) : (
                  <div className="time-slots">
                    {availableSlots.length > 0 ? (
                      availableSlots.map(slot => (
                        <div
                          key={slot}
                          className={`time-slot ${formData.time === slot ? 'selected' : ''}`}
                          onClick={() => handleTimeSlotSelect(slot)}
                        >
                          {slot}
                        </div>
                      ))
                    ) : (
                      <p>No available time slots for this date. Please choose another date.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="reason">Reason for Visit *</label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                required
                placeholder="Please describe the reason for your visit"
              />
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={!isFormValid() || loading}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;