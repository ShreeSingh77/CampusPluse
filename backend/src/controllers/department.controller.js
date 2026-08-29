const Department = require("../models/Department");

// ==========================================
// GET ALL ACTIVE DEPARTMENTS
// ADMIN / SUPER ADMIN
// ==========================================

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({
      isActive: true,
    }).sort({
      name: 1,
    });

    return res.status(200).json({
      success: true,
      count: departments.length,
      departments,
    });
  } catch (error) {
    console.error(
      "Get Departments Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getDepartments,
};