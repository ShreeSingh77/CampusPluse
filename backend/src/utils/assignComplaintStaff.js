const User = require("../models/User");

const findAvailableStaff = async (departmentId) => {
  if (!departmentId) {
    return null;
  }

  const staff = await User.findOne({
    role: "staff",
    isActive: true,
    department: departmentId,
  }).sort({
    createdAt: 1,
  });

  return staff;
};

module.exports = findAvailableStaff;