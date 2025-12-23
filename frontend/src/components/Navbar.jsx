import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-briefcase-fill me-2"></i>JobBoard Pro
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" to="/">Find Jobs</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <span className="text-white me-3 d-none d-lg-block">
                  Welcome, <strong>{user.name || user.role}</strong>
                </span>
                
                {user.role === 'recruiter' ? (
                  <Link to="/recruiter" className="btn btn-light text-primary fw-semibold btn-sm">
                    Recruiter Panel
                  </Link>
                ) : (
                  <Link to="/dashboard" className="btn btn-outline-light btn-sm">
                    Candidate Dashboard
                  </Link>
                )}

                <button onClick={handleLogout} className="btn btn-danger btn-sm ms-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light btn-sm">Login</Link>
                <Link to="/register" className="btn btn-light text-primary btn-sm fw-bold">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}