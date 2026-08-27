const bcrypt = require("bcrypt");
const User = require("../models/User");
require("../models/Department");
// ==========================================
// GET ALL STAFF USERS
// ==========================================
const getStaffUsers = async (req, res) => {
  try {
    const staff = await User.find({
  role: "staff",
  isActive: true,
})
  .select(
    "name email phone department profileImage role isActive"
  )
  .populate(
    "department",
    "name code description"
  );

    return res.status(200).json({
      success: true,
      count: staff.length,
      staff,
    });
  } catch (error) {
    console.error(
      "Get Staff Users Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ==========================================
// CREATE STAFF USER
// ADMIN ONLY
// ==========================================
const createStaffUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      department,
    } = req.body;

    // Required fields
    if (!name || !email || !password || !department) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, password and department are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create staff
    const staff = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "staff",
      phone: phone || null,
      department,
      isActive: true,
      isEmailVerified: false,
    });

    return res.status(201).json({
      success: true,
      message: "Staff account created successfully",
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        phone: staff.phone,
        department: staff.department,
        isActive: staff.isActive,
      },
    });
  } catch (error) {
    console.error(
      "Create Staff Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ==========================================
// EXPORTS
// ==========================================
module.exports = {
  getStaffUsers,
  createStaffUser,
};