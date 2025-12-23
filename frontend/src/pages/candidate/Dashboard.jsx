import { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function CandidateDashboard() {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch applications on load
  useEffect(() => {
    api.get('/candidate/applications') //
      .then((res) => setApplications(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Handle Resume Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.warning("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('resume', file); //

    try {
      await api.post('/candidate/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Resume updated successfully!');
      setFile(null);
      // Optional: You could refresh profile data here if you had a profile endpoint
    } catch (err) {
      toast.error('Upload failed. Ensure it is a PDF.');
    }
  };

  // Calculate Stats
  const stats = {
    applied: applications.length,
    shortlisted: applications.filter(app => app.status === 'shortlisted').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-5">
      {/* 1. Header & Welcome */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark">Dashboard</h2>
        <p className="text-muted">Welcome back, <span className="fw-semibold text-primary">{user?.name || 'Candidate'}</span></p>
      </div>

      {/* 2. Stats Row */}
      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm border-start border-4 border-primary h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted text-uppercase small fw-bold mb-1">Total Applications</h6>
                  <h2 className="mb-0 fw-bold">{stats.applied}</h2>
                </div>
                <div className="bg-light p-3 rounded-circle text-primary">
                  <i className="bi bi-briefcase fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm border-start border-4 border-success h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted text-uppercase small fw-bold mb-1">Shortlisted</h6>
                  <h2 className="mb-0 fw-bold">{stats.shortlisted}</h2>
                </div>
                <div className="bg-light p-3 rounded-circle text-success">
                  <i className="bi bi-star fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm border-start border-4 border-danger h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted text-uppercase small fw-bold mb-1">Rejected</h6>
                  <h2 className="mb-0 fw-bold">{stats.rejected}</h2>
                </div>
                <div className="bg-light p-3 rounded-circle text-danger">
                  <i className="bi bi-x-circle fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* 3. Left Column: Profile & Resume */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">My Profile</h5>
            </div>
            <div className="card-body text-center py-4">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '80px', height: '80px', fontSize: '2rem'}}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h5 className="fw-bold">{user?.name}</h5>
              <p className="text-muted small mb-3">{user?.email}</p>
              <span className="badge bg-light text-dark border px-3 py-2">
                {user?.role?.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-header bg-dark text-white py-3">
              <h5 className="mb-0 fw-bold"><i className="bi bi-cloud-upload me-2"></i>Update Resume</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleUpload}>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Select PDF File</label>
                  <input 
                    type="file" 
                    className="form-control"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <div className="form-text text-muted small">
                    <i className="bi bi-info-circle me-1"></i>
                    Uploading a new resume will only affect future applications.
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 fw-semibold"
                  disabled={!file}
                >
                  Upload Resume
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 4. Right Column: Application History */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Application History</h5>
              <span className="badge bg-primary rounded-pill">{applications.length} Items</span>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light text-muted small text-uppercase">
                    <tr>
                      <th className="ps-4 py-3">Job Role</th>
                      <th>Applied Date</th>
                      <th>Resume Sent</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.length > 0 ? applications.map((app) => (
                      <tr key={app._id}>
                        <td className="ps-4 py-3">
                          <div className="fw-bold text-dark">{app.jobId?.title || 'Job Removed'}</div>
                          <div className="small text-muted">{app.jobId?.sector || 'N/A'}</div>
                        </td>
                        <td className="text-muted small">
                          <i className="bi bi-calendar-event me-2"></i>
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          {/* Link to view the specific resume used for this app */}
                          {app.resumePath ? (
                            <a 
                              href={`http://localhost:4000/${app.resumePath}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-decoration-none small"
                            >
                              <i className="bi bi-file-earmark-pdf text-danger me-1"></i> View PDF
                            </a>
                          ) : (
                            <span className="text-muted small">Missing</span>
                          )}
                        </td>
                        <td>
                          {app.status === 'applied' && <span className="badge bg-warning text-dark border border-warning">Pending</span>}
                          {app.status === 'shortlisted' && <span className="badge bg-success">Shortlisted</span>}
                          {app.status === 'rejected' && <span className="badge bg-secondary">Rejected</span>}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="text-center py-5">
                          <div className="text-muted">
                            <i className="bi bi-journal-x fs-1 d-block mb-3"></i>
                            You haven't applied to any jobs yet.
                          </div>
                          <a href="/" className="btn btn-outline-primary btn-sm mt-2">Find Jobs</a>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}