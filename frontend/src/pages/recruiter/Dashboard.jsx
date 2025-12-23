import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', sector: 'IT' });
  const [loading, setLoading] = useState(true);

  // Fetch jobs on mount
  const fetchJobs = async () => {
    try {
      const res = await api.get('/recruiter/jobs'); // Matches backend route
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // Matches backend route POST /api/jobs
      await api.post('/jobs', formData);
      toast.success('Job Posted Successfully!');
      setFormData({ title: '', description: '', sector: 'IT' }); // Reset form
      fetchJobs(); // Refresh list
    } catch (err) {
      toast.error('Failed to create job');
    }
  };

  return (
    <div className="container py-5">
      <div className="row g-5">
        
        {/* === LEFT COLUMN: POST A JOB === */}
        <div className="col-lg-4">
          <div className="card shadow border-0 sticky-top" style={{ top: '90px', zIndex: 1 }}>
            <div className="card-header bg-dark text-white py-3">
              <h5 className="mb-0 fw-bold"><i className="bi bi-plus-circle me-2"></i>Post New Job</h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleCreate}>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold uppercase">Job Title</label>
                  <input 
                    placeholder="e.g. Senior React Developer" 
                    className="form-control form-control-lg"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold uppercase">Target Sector</label>
                  <select 
                    className="form-select"
                    value={formData.sector}
                    onChange={e => setFormData({...formData, sector: e.target.value})}
                  >
                    <option value="IT">IT & Software</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">Human Resources</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted small fw-bold uppercase">Job Description</label>
                  <textarea 
                    placeholder="Describe the role, responsibilities, and requirements..." 
                    className="form-control"
                    rows="6"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>

                <button className="btn btn-primary w-100 fw-bold py-2">
                  <i className="bi bi-send-fill me-2"></i>Publish Job
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* === RIGHT COLUMN: POSTED JOBS LIST === */}
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 fw-bold text-dark mb-0">Active Job Listings</h2>
            <span className="badge bg-secondary rounded-pill fs-6 px-3">{jobs.length} Jobs</span>
          </div>

          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {jobs.length > 0 ? jobs.map(job => (
                <div key={job._id} className="card shadow-sm border-start border-4 border-primary hover-shadow transition">
                  <div className="card-body p-4">
                    <div className="row align-items-center">
                      <div className="col-md-8 mb-3 mb-md-0">
                        <h5 className="card-title fw-bold text-dark mb-1">{job.title}</h5>
                        <div className="mb-2">
                          <span className="badge bg-light text-dark border me-2">
                            <i className="bi bi-building me-1"></i>{job.sector}
                          </span>
                          <small className="text-muted">
                            <i className="bi bi-clock me-1"></i>
                            Posted: {new Date(job.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <p className="card-text text-muted text-truncate" style={{ maxWidth: '90%' }}>
                          {job.description}
                        </p>
                      </div>
                      
                      <div className="col-md-4 text-md-end">
                        <Link 
                          to={`/recruiter/jobs/${job._id}`}
                          className="btn btn-outline-primary btn-sm px-4 fw-semibold"
                        >
                          Manage Applicants <i className="bi bi-arrow-right ms-2"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-5 bg-white rounded border border-dashed">
                  <i className="bi bi-clipboard-x text-muted display-4"></i>
                  <p className="mt-3 text-muted">You haven't posted any jobs yet.</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}