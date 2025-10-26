const axios = require('axios');

async function testCreateJob() {
  try {
    console.log('🚀 Creating test job...');

    const response = await axios.post('http://localhost:5000/api/jobs', {
      companyName: 'Microsoft',
      jobTitle: 'Backend Developer',
      applicationDate: '2024-10-26',
      status: 'Interview',
    });

    console.log('✅ Job created successfully:');
    console.log(response.data);

    // Also test getting all jobs
    const allJobs = await axios.get('http://localhost:5000/api/jobs');
    console.log('📋 All jobs:', allJobs.data);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testCreateJob();
