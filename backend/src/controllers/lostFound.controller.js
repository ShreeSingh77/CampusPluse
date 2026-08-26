const LostFound = require("../models/LostFound");

// ==========================================
// SMART MATCHING SCORE
// ==========================================

const calculateMatchScore = (lostItem, foundItem) => {
  let score = 0;
  const reasons = [];

  // Category match
  if (lostItem.category === foundItem.category) {
    score += 35;
    reasons.push("Same category");
  }

  // Location match
  if (
    lostItem.location.toLowerCase() ===
    foundItem.location.toLowerCase()
  ) {
    score += 30;
    reasons.push("Same location");
  }

  // Date difference
  const lostDate = new Date(lostItem.date);
  const foundDate = new Date(foundItem.date);

  const difference =
    Math.abs(lostDate - foundDate) /
    (1000 * 60 * 60 * 24);

  if (difference <= 1) {
    score += 20;
    reasons.push("Reported within 1 day");
  } else if (difference <= 3) {
    score += 10;
    reasons.push("Reported within 3 days");
  }

  // Title similarity
  const lostWords = lostItem.title
    .toLowerCase()
    .split(/\s+/);

  const foundWords = foundItem.title
    .toLowerCase()
    .split(/\s+/);

  const commonWords = lostWords.filter((word) =>
    foundWords.includes(word)
  );

  if (commonWords.length > 0) {
    score += Math.min(commonWords.length * 5, 15);
    reasons.push("Similar item description");
  }

  return {
    score,
    reasons,
  };
};

// ==========================================
// CREATE LOST / FOUND REPORT
// ==========================================

const createReport = async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      category,
      location,
      date,
      image,
    } = req.body;

    if (
      !type ||
      !title ||
      !description ||
      !category ||
      !location ||
      !date
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Type, title, description, category, location and date are required",
      });
    }

    if (!["lost", "found"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be either lost or found",
      });
    }

    const report = await LostFound.create({
      type,
      title,
      description,
      category,
      location,
      date,
      image: image || null,
      reportedBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: `${type} item reported successfully`,
      report,
    });
  } catch (error) {
    console.error(
      "Create Lost/Found Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==========================================
// GET LOST / FOUND REPORTS
// ==========================================

const getReports = async (req, res) => {
  try {
    const {
      type,
      category,
      location,
      search,
    } = req.query;

    const filter = {
      status: "active",
    };

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const reports = await LostFound.find(filter)
      .populate(
        "reportedBy",
        "name email role"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error(
      "Get Lost/Found Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==========================================
// FIND SMART MATCHES
// ==========================================

const findMatches = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await LostFound.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Lost/Found report not found",
      });
    }

    const oppositeType =
      item.type === "lost"
        ? "found"
        : "lost";

    const oppositeItems =
      await LostFound.find({
        type: oppositeType,
        status: "active",
        category: item.category,
      }).populate(
        "reportedBy",
        "name email role"
      );

    const matches = oppositeItems
      .map((candidate) => {
        const result =
          item.type === "lost"
            ? calculateMatchScore(
                item,
                candidate
              )
            : calculateMatchScore(
                candidate,
                item
              );

        return {
          item: candidate,
          matchScore: result.score,
          reasons: result.reasons,
        };
      })
      .filter(
        (match) =>
          match.matchScore >= 30
      )
      .sort(
        (a, b) =>
          b.matchScore -
          a.matchScore
      );

    return res.status(200).json({
      success: true,
      count: matches.length,
      matches,
    });
  } catch (error) {
    console.error(
      "Find Matches Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
  createReport,
  getReports,
  findMatches,
};