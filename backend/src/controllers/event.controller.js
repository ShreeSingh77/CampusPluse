const Event = require("../models/Event");
const crypto = require("crypto");

const generateCheckInCode = () => {
  return crypto
    .randomInt(100000, 1000000)
    .toString();
};
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      venue,
      department,
      eventDate,
      registrationDeadline,
      maxParticipants,
    } = req.body;

    if (
      !title ||
      !description ||
      !venue ||
      !eventDate ||
      !registrationDeadline ||
      !maxParticipants
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, venue, event date, registration deadline and max participants are required",
      });
    }

    const event = await Event.create({
      title,
      description,
      category,
      venue,
      department,
      eventDate,
      registrationDeadline,
      maxParticipants,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error(
      "Create Event Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({
      isPublished: true,
    })
      .populate("createdBy", "name email role")
      .sort({
        eventDate: 1,
      });

    return res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error(
      "Get Events Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const EventRegistration = require("../models/EventRegistration");

const registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Find event
    const event = await Event.findById(id);

    if (!event || !event.isPublished) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check registration deadline
    const now = new Date();

    if (now > event.registrationDeadline) {
      return res.status(400).json({
        success: false,
        message: "Event registration deadline has passed",
      });
    }

    // Check event date
    if (now > event.eventDate) {
      return res.status(400).json({
        success: false,
        message: "This event has already started or ended",
      });
    }

    // Check capacity
    if (event.registrationCount >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: "Event registration is full",
      });
    }

    // Check duplicate registration
    const existingRegistration =
      await EventRegistration.findOne({
        event: event._id,
        student: req.user._id,
      });

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: "You are already registered for this event",
      });
    }

    // Create registration
    const registration = await EventRegistration.create({
      event: event._id,
      student: req.user._id,
    });

    // Increase registration count
    event.registrationCount += 1;

    await event.save();

    return res.status(201).json({
      success: true,
      message: "Event registration successful",
      registration,
    });
  } catch (error) {
    console.error(
      "Event Registration Error:",
      error.message
    );

    // Duplicate index protection
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You are already registered for this event",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMyRegistrations = async (req, res) => {
  try {
    const registrations =
      await EventRegistration.find({
        student: req.user._id,
        status: {
          $ne: "cancelled",
        },
      })
        .populate(
          "event",
          "title category venue eventDate registrationDeadline"
        )
        .sort({
          registeredAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    console.error(
      "Get My Registrations Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await EventRegistration.findOne({
      _id: id,
      student: req.user._id,
    }).populate("event");

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Event registration not found",
      });
    }

    if (registration.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled registration cannot be marked as attended",
      });
    }

    if (registration.status === "attended") {
      return res.status(409).json({
        success: false,
        message: "Attendance already marked",
      });
    }

    const now = new Date();
    const eventDate = new Date(registration.event.eventDate);

    // Allow check-in from 2 hours before event
    const checkInStart = new Date(
      eventDate.getTime() - 2 * 60 * 60 * 1000
    );

    // Allow check-in until 2 hours after event starts
    const checkInEnd = new Date(
      eventDate.getTime() + 2 * 60 * 60 * 1000
    );

    if (now < checkInStart) {
      return res.status(400).json({
        success: false,
        message: "Attendance check-in has not started yet",
      });
    }

    if (now > checkInEnd) {
      return res.status(400).json({
        success: false,
        message: "Attendance check-in period has ended",
      });
    }

    registration.status = "attended";
    registration.attendedAt = now;

    await registration.save();

    return res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      attendance: {
        registrationId: registration._id,
        eventId: registration.event._id,
        eventTitle: registration.event.title,
        attendedAt: registration.attendedAt,
      },
    });
  } catch (error) {
    console.error(
      "Mark Attendance Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getEventAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const totalRegistrations =
      await EventRegistration.countDocuments({
        event: id,
        status: {
          $ne: "cancelled",
        },
      });

    const attended =
      await EventRegistration.countDocuments({
        event: id,
        status: "attended",
      });

    const absent = Math.max(
      totalRegistrations - attended,
      0
    );

    const availableSeats = Math.max(
      event.maxParticipants - totalRegistrations,
      0
    );

    const attendanceRate =
      totalRegistrations > 0
        ? Number(
            ((attended / totalRegistrations) * 100).toFixed(2)
          )
        : 0;

    return res.status(200).json({
      success: true,
      analytics: {
        eventId: event._id,
        eventTitle: event.title,
        maxParticipants: event.maxParticipants,
        totalRegistrations,
        attended,
        absent,
        availableSeats,
        attendanceRate,
      },
    });
  } catch (error) {
    console.error(
      "Event Analytics Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const openEventCheckIn = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (!event.isPublished) {
      return res.status(400).json({
        success: false,
        message: "Cannot open check-in for an unpublished event",
      });
    }

    if (event.isCheckInOpen) {
      return res.status(409).json({
        success: false,
        message: "Check-in is already open",
        checkInCode: event.checkInCode,
      });
    }

    const checkInCode = generateCheckInCode();

    event.checkInCode = checkInCode;
    event.isCheckInOpen = true;
    event.checkInOpenedAt = new Date();

    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event check-in opened successfully",
      checkInCode,
      eventId: event._id,
    });
  } catch (error) {
    console.error(
      "Open Check-in Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const closeEventCheckIn = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    event.isCheckInOpen = false;
    event.checkInCode = null;

    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event check-in closed successfully",
    });
  } catch (error) {
    console.error(
      "Close Check-in Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const checkInToEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkInCode } = req.body;

    if (!checkInCode) {
      return res.status(400).json({
        success: false,
        message: "Check-in code is required",
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (!event.isCheckInOpen) {
      return res.status(400).json({
        success: false,
        message: "Event check-in is currently closed",
      });
    }

    if (event.checkInCode !== checkInCode) {
      return res.status(401).json({
        success: false,
        message: "Invalid check-in code",
      });
    }

    const registration =
      await EventRegistration.findOne({
        event: event._id,
        student: req.user._id,
      });

    if (!registration) {
      return res.status(403).json({
        success: false,
        message:
          "You must register for this event before checking in",
      });
    }

    if (registration.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled registration cannot check in",
      });
    }

    if (registration.status === "attended") {
      return res.status(409).json({
        success: false,
        message: "Attendance already marked",
      });
    }

    registration.status = "attended";
    registration.attendedAt = new Date();

    await registration.save();

    return res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      attendance: {
        eventId: event._id,
        eventTitle: event.title,
        studentId: req.user._id,
        attendedAt: registration.attendedAt,
      },
    });
  } catch (error) {
    console.error(
      "Event Check-in Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
module.exports = {
  createEvent,
  getEvents,
 registerForEvent,
 getMyRegistrations,
 markAttendance,
 getEventAnalytics,
 openEventCheckIn,
 closeEventCheckIn,
 checkInToEvent,
};