const express = require('express');
const router = express.Router();
const Job = require('../models/Job'); // Make sure this path is correct

// GET all jobs
router.get('/', async (req, res) => {
  try {
    console.log(' GET /api/jobs called'); // Add this for debugging
    const jobs = await Job.find().sort({ applicationDate: -1 });
    console.log(' Found jobs:', jobs); // Add this
    res.json(jobs);
  } catch (error) {
    console.log(' GET Error:', error); // Add this
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new job
router.post('/', async (req, res) => {
  try {
    const { companyName, jobTitle, applicationDate, status } = req.body;

    // Validation
    if (!companyName || companyName.trim().length < 3) {
      return res
        .status(400)
        .json({ error: 'Company name must be at least 3 characters' });
    }
    if (!jobTitle || jobTitle.trim().length === 0) {
      return res.status(400).json({ error: 'Job title is required' });
    }
    if (!applicationDate) {
      return res.status(400).json({ error: 'Application date is required' });
    }

    const newJob = new Job({
      companyName: companyName.trim(),
      jobTitle: jobTitle.trim(),
      applicationDate,
      status: status || 'Applied',
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE job
router.put('/:id', async (req, res) => {
  try {
    const { companyName, jobTitle, applicationDate, status } = req.body;

    // Validation
    if (!companyName || companyName.trim().length < 3) {
      return res
        .status(400)
        .json({ error: 'Company name must be at least 3 characters' });
    }
    if (!jobTitle || jobTitle.trim().length === 0) {
      return res.status(400).json({ error: 'Job title is required' });
    }
    if (!applicationDate) {
      return res.status(400).json({ error: 'Application date is required' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      {
        companyName: companyName.trim(),
        jobTitle: jobTitle.trim(),
        applicationDate,
        status,
      },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE job
router.delete('/:id', async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
