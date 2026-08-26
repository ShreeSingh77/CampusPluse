const Event = require("../models/Event");

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
module.exports = {
  createEvent,
  getEvents,
 registerForEvent,
 getMyRegistrations,
};