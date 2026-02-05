// backend/controllers/dashboardController.js

const Prediction = require('../models/Prediction'); // Adjust model import as needed

// Controller to get dashboard risk summary and detailed data
const getRiskDashboardData = async (req, res) => {
  try {
    // Aggregate counts per risk level ('Low', 'Medium', 'High')
    const riskData = await Prediction.aggregate([
      {
        $group: {
          _id: '$riskLevel', // e.g. 'Low', 'Medium', 'High'
          count: { $sum: 1 }
        }
      }
    ]);

    // Get detailed prediction documents, sorted by newest first
    const detailedData = await Prediction.find({}, { _id: 0, features: 1, riskLevel: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .limit(100);

    // Send response with summary and detailed data
    res.status(200).json({
      summary: riskData,
      details: detailedData
    });
  } catch (error) {
    console.error('Error retrieving dashboard data:', error);
    res.status(500).json({ message: 'Error retrieving dashboard data', error: error.message });
  }
};

module.exports = { getRiskDashboardData };
