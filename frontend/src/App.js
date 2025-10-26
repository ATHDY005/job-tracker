import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/jobs';
function App() {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    applicationDate: '',
    status: 'Applied',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(API_URL);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    } else if (formData.companyName.trim().length < 3) {
      newErrors.companyName = 'Company name must be at least 3 characters';
    }

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }

    if (!formData.applicationDate) {
      newErrors.applicationDate = 'Application date is required';
    } else if (new Date(formData.applicationDate) > new Date()) {
      newErrors.applicationDate = 'Application date cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editingJob) {
        await axios.put(`${API_URL}/${editingJob._id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }

      fetchJobs();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.error || 'Something went wrong');
    }
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      jobTitle: '',
      applicationDate: '',
      status: 'Applied',
    });
    setEditingJob(null);
    setShowForm(false);
    setErrors({});
  };

  const handleEdit = (job) => {
    const date = new Date(job.applicationDate);
    const formattedDate = date.toISOString().split('T')[0];

    setFormData({
      companyName: job.companyName,
      jobTitle: job.jobTitle,
      applicationDate: formattedDate,
      status: job.status,
    });
    setEditingJob(job);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchJobs();
      } catch (error) {
        alert('Error deleting job');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Job Application Tracker</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Add New Job
        </button>
      </header>

      {/* Single Job View Modal */}
      {selectedJob && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Job Application Details</h2>

            <div className="job-details">
              <div className="detail-group">
                <label>Company:</label>
                <p>{selectedJob.companyName}</p>
              </div>

              <div className="detail-group">
                <label>Job Title:</label>
                <p>{selectedJob.jobTitle}</p>
              </div>

              <div className="detail-group">
                <label>Application Date:</label>
                <p>{formatDate(selectedJob.applicationDate)}</p>
              </div>

              <div className="detail-group">
                <label>Status:</label>
                <span
                  className={`status status-${selectedJob.status.toLowerCase()}`}
                >
                  {selectedJob.status}
                </span>
              </div>

              <div className="detail-group">
                <label>Created:</label>
                <p>{formatDate(selectedJob.createdAt)}</p>
              </div>
            </div>

            <div className="form-actions">
              <button
                className="btn btn-edit"
                onClick={() => {
                  handleEdit(selectedJob);
                  setSelectedJob(null);
                }}
              >
                Edit Job
              </button>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Job Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingJob ? 'Edit Job' : 'Add New Job'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={errors.companyName ? 'error' : ''}
                  placeholder="Enter company name"
                />
                {errors.companyName && (
                  <span className="error-text">{errors.companyName}</span>
                )}
              </div>

              <div className="form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className={errors.jobTitle ? 'error' : ''}
                  placeholder="Enter job title"
                />
                {errors.jobTitle && (
                  <span className="error-text">{errors.jobTitle}</span>
                )}
              </div>

              <div className="form-group">
                <label>Application Date *</label>
                <input
                  type="date"
                  name="applicationDate"
                  value={formData.applicationDate}
                  onChange={handleInputChange}
                  className={errors.applicationDate ? 'error' : ''}
                />
                {errors.applicationDate && (
                  <span className="error-text">{errors.applicationDate}</span>
                )}
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingJob ? 'Update Job' : 'Add Job'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="main-content">
        {jobs.length === 0 ? (
          <div className="empty-state">
            <h2>No job applications yet</h2>
            <p>Start by adding your first job application!</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add Your First Job
            </button>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="job-card"
                onClick={() => handleJobClick(job)}
                style={{ cursor: 'pointer' }}
              >
                <div className="job-header">
                  <h3 className="company">{job.companyName}</h3>
                  <span className={`status status-${job.status.toLowerCase()}`}>
                    {job.status}
                  </span>
                </div>

                <p className="title">{job.jobTitle}</p>
                <p className="date">
                  Applied: {formatDate(job.applicationDate)}
                </p>

                <div className="job-actions">
                  <button
                    className="btn btn-edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(job);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(job._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
