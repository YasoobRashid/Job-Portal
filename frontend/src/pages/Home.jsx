import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [sectorFilter, setSectorFilter] = useState('');
  const { user } = useContext(AuthContext);

  const fetchJobs = async () => {
    const url = sectorFilter ? `/jobs?sector=${sectorFilter}` : '/jobs';
    const { data } = await api.get(url);
    setJobs(data);
  };

  useEffect(() => { fetchJobs(); }, [sectorFilter]);

  // (WebSocket logic remains here as previously provided)

  return (
    <div className="container py-5">
      {/* Header & Filter */}
      <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm border">
        <h2 className="h4 mb-0 text-dark">Latest Openings</h2>
        <select 
          className="form-select w-auto" 
          onChange={(e) => setSectorFilter(e.target.value)}
          value={sectorFilter}
        >
          <option value="">All Sectors</option>
          <option value="IT">IT & Software</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
        </select>
      </div>

      {/* Jobs Grid */}
      <div className="row g-4">
        {jobs.length > 0 ? jobs.map((job) => (
          <div key={job._id} className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm hover-shadow transition">
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="card-title fw-bold text-primary">{job.title}</h5>
                  <span className="badge bg-light text-dark border">{job.sector}</span>
                </div>
                <p className="card-text text-muted flex-grow-1">{job.description}</p>
                
                {user?.role === 'candidate' ? (
                  <button 
                    onClick={() => api.post('/candidate/apply', { jobId: job._id })
                      .then(() => toast.success('Applied!'))
                      .catch(err => toast.error(err.response?.data?.message))}
                    className="btn btn-primary w-100 mt-3"
                  >
                    <i className="bi bi-send me-2"></i>Apply Now
                  </button>
                ) : (
                  <div className="mt-3 text-end">
                     <span className="text-muted small">Login as Candidate to Apply</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted">No jobs found in this sector.</p>
          </div>
        )}
      </div>
    </div>
  );
}