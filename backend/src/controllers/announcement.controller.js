const Announcement = require("../models/Announcement");
const {
  calculatePriority,
} = require("../utils/priorityEngine");

const createAnnouncement = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      department,
      deadline,
      eventDate,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const priorityData = calculatePriority({
      category,
      deadline,
      eventDate,
    });

    const announcement = await Announcement.create({
      title,
      description,
      category,
      department,
      deadline,
      eventDate,

      priority: priorityData.priority,
      priorityScore: priorityData.score,
      priorityReason: priorityData.reason,

      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      announcement,
    });
  } catch (error) {
    console.error(
      "Create Announcement Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({
      isPublished: true,
    })
      .populate("createdBy", "name email role")
      .sort({
        priorityScore: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    console.error(
      "Get Announcements Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      category,
      department,
      deadline,
      eventDate,
      isPublished,
    } = req.body;

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    // Recalculate priority using updated values
    const priorityData = calculatePriority({
      category: category ?? announcement.category,
      deadline: deadline ?? announcement.deadline,
      eventDate: eventDate ?? announcement.eventDate,
    });

    announcement.title = title ?? announcement.title;
    announcement.description =
      description ?? announcement.description;
    announcement.category =
      category ?? announcement.category;
    announcement.department =
      department ?? announcement.department;
    announcement.deadline =
      deadline ?? announcement.deadline;
    announcement.eventDate =
      eventDate ?? announcement.eventDate;
    announcement.isPublished =
      isPublished ?? announcement.isPublished;

    announcement.priority = priorityData.priority;
    announcement.priorityScore = priorityData.score;
    announcement.priorityReason = priorityData.reason;

    await announcement.save();

    return res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      announcement,
    });
  } catch (error) {
    console.error(
      "Update Announcement Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
module.exports = {
  createAnnouncement,
  getAnnouncements,
updateAnnouncement,
};