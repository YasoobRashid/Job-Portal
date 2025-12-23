import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
    sector: 'IT'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light py-5">
      <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="card-header bg-primary text-white text-center py-4">
          <h3 className="mb-0 fw-bold"><i className="bi bi-person-plus-fill me-2"></i>Create Account</h3>
          <p className="mb-0 text-white-50 small">Join our professional network today</p>
        </div>
        
        <div className="card-body p-4 p-md-5">
          <form onSubmit={handleSubmit} className="row g-3">
            
            {/* Name */}
            <div className="col-12">
              <label className="form-label fw-semibold">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-light"><i className="bi bi-person"></i></span>
                <input
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder="John Doe"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="col-12">
              <label className="form-label fw-semibold">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="col-12">
              <label className="form-label fw-semibold">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light"><i className="bi bi-lock"></i></span>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <hr className="my-4 text-muted" />

            {/* Role Selection - Visual Cards */}
            <div className="col-12">
              <label className="form-label fw-semibold mb-2">I want to...</label>
              <div className="d-flex gap-3">
                <div className="form-check card-radio w-50">
                  <input 
                    className="btn-check" 
                    type="radio" 
                    name="role" 
                    id="roleCandidate" 
                    value="candidate" 
                    checked={formData.role === 'candidate'}
                    onChange={handleChange}
                  />
                  <label className="btn btn-outline-primary w-100 py-3" htmlFor="roleCandidate">
                    <i className="bi bi-search d-block fs-4 mb-1"></i>
                    Find a Job
                  </label>
                </div>
                <div className="form-check card-radio w-50">
                  <input 
                    className="btn-check" 
                    type="radio" 
                    name="role" 
                    id="roleRecruiter" 
                    value="recruiter"
                    checked={formData.role === 'recruiter'}
                    onChange={handleChange}
                  />
                  <label className="btn btn-outline-dark w-100 py-3" htmlFor="roleRecruiter">
                    <i className="bi bi-briefcase d-block fs-4 mb-1"></i>
                    Hire Talent
                  </label>
                </div>
              </div>
            </div>

            {/* Sector */}
            <div className="col-12">
              <label className="form-label fw-semibold">Primary Sector</label>
              <select
                name="sector"
                className="form-select"
                value={formData.sector}
                onChange={handleChange}
              >
                <option value="IT">IT & Software</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">Human Resources</option>
              </select>
            </div>

            <div className="col-12 mt-4">
              <button className="btn btn-primary w-100 py-2 fw-bold shadow-sm" type="submit">
                Register Now
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <span className="text-muted">Already have an account? </span>
            <Link to="/login" className="text-decoration-none fw-bold">Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}