import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';

export default function JobApplications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Applications (matches backend route)
        //
        const { data } = await api.get(`/recruiter/jobs/${jobId}/applications`);
        setApplications(data);

        // 2. Fetch Job Details (to show title in header)
        // We reuse the public job fetch or find it from the previous list state
        // For simplicity, we just look at the first application's job data if available, 
        // or fetch specific job details if you have that endpoint. 
        // Here we assume the Recruiter wants to see the list immediately.
      } catch (err) {
        toast.error('Could not load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId]);

  const updateStatus = async (appId, status) => {
    try {
      // Matches backend route PATCH /recruiter/applications/:applicationId
      //
      await api.patch(`/recruiter/applications/${appId}`, { status });
      
      setApplications(apps => apps.map(app => 
        app._id === appId ? { ...app, status } : app
      ));
      
      const msg = status === 'shortlisted' ? 'Candidate Shortlisted! 🎉' : 'Candidate Rejected';
      toast.success(msg);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  // Derived Statistics
  const stats = {
    total: applications.length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-5">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Link to="/recruiter" className="text-decoration-none text-muted small mb-2 d-block">
            <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
          </Link>
          <h2 className="fw-bold mb-0">Candidate Applications</h2>
          <p className="text-muted">Manage candidates for your job opening</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-primary text-white h-100">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-white-50 text-uppercase small fw-bold">Total Applicants</h6>
                <h2 className="mb-0 fw-bold">{stats.total}</h2>
              </div>
              <i className="bi bi-people fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-success text-white h-100">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-white-50 text-uppercase small fw-bold">Shortlisted</h6>
                <h2 className="mb-0 fw-bold">{stats.shortlisted}</h2>
              </div>
              <i className="bi bi-check-circle fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-light text-dark h-100">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-muted text-uppercase small fw-bold">Rejected</h6>
                <h2 className="mb-0 fw-bold">{stats.rejected}</h2>
              </div>
              <i className="bi bi-x-circle fs-1 text-muted opacity-50"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      <div className="card shadow border-0">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-bold">Applicants List</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="ps-4 py-3">Candidate Name</th>
                <th className="py-3">Details</th>
                <th className="py-3">Applied Date</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length > 0 ? applications.map(app => (
                <tr key={app._id}>
                  <td className="ps-4">
                    <div className="d-flex align-items-center">
                      <div className="bg-light rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold me-3" style={{width: '40px', height: '40px'}}>
                        {app.candidateId?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h6 className="mb-0 fw-semibold text-dark">{app.candidateId?.name}</h6>
                        <small className="text-muted">{app.candidateId?.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    {/* Resume Link */}
                    {app.resumePath ? (
                      <a 
                        href={`http://localhost:4000/${app.resumePath}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-secondary"
                      >
                        <i className="bi bi-file-earmark-pdf me-2"></i>View Resume
                      </a>
                    ) : (
                      <span className="text-muted small">No Resume</span>
                    )}
                  </td>
                  <td className="text-muted small">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    {app.status === 'applied' && <span className="badge bg-warning text-dark">Pending Review</span>}
                    {app.status === 'shortlisted' && <span className="badge bg-success">Shortlisted</span>}
                    {app.status === 'rejected' && <span className="badge bg-secondary">Rejected</span>}
                  </td>
                  <td className="text-end pe-4">
                    <div className="btn-group">
                      <button 
                        onClick={() => updateStatus(app._id, 'shortlisted')}
                        className={`btn btn-sm ${app.status === 'shortlisted' ? 'btn-success disabled' : 'btn-outline-success'}`}
                        title="Shortlist"
                      >
                        <i className="bi bi-check-lg"></i>
                      </button>
                      <button 
                        onClick={() => updateStatus(app._id, 'rejected')}
                        className={`btn btn-sm ${app.status === 'rejected' ? 'btn-secondary disabled' : 'btn-outline-danger'}`}
                        title="Reject"
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <div className="text-muted">
                      <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                      No applications received for this job yet.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}