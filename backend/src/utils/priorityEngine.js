const calculatePriority = ({
  category,
  deadline,
  eventDate,
}) => {
  let score = 0;
  const reasons = [];

  // Category based priority
  if (category === "emergency") {
    score += 60;
    reasons.push("Emergency announcement");
  }

  if (category === "exam") {
    score += 30;
    reasons.push("Exam-related announcement");
  }

  if (category === "placement") {
    score += 25;
    reasons.push("Placement-related announcement");
  }

  // Deadline based priority
  if (deadline) {
    const now = new Date();
    const deadlineDate = new Date(deadline);

    const difference =
      deadlineDate.getTime() - now.getTime();

    const daysRemaining =
      difference / (1000 * 60 * 60 * 24);

    if (daysRemaining <= 1 && daysRemaining >= 0) {
      score += 35;
      reasons.push("Deadline is within 24 hours");
    } else if (daysRemaining <= 3 && daysRemaining >= 0) {
      score += 20;
      reasons.push("Deadline is approaching");
    } else if (daysRemaining <= 7 && daysRemaining >= 0) {
      score += 10;
      reasons.push("Deadline is within one week");
    }
  }

  // Event date
  if (eventDate) {
    const now = new Date();
    const event = new Date(eventDate);

    const difference =
      event.getTime() - now.getTime();

    const daysRemaining =
      difference / (1000 * 60 * 60 * 24);

    if (daysRemaining <= 1 && daysRemaining >= 0) {
      score += 20;
      reasons.push("Event is within 24 hours");
    } else if (daysRemaining <= 3 && daysRemaining >= 0) {
      score += 10;
      reasons.push("Event is approaching");
    }
  }

  let priority = "low";

  if (score >= 60) {
    priority = "urgent";
  } else if (score >= 35) {
    priority = "high";
  } else if (score >= 15) {
    priority = "normal";
  }

  return {
    priority,
    score,
    reason:
      reasons.length > 0
        ? reasons.join(" + ")
        : "No immediate urgency detected",
  };
};

module.exports = {
  calculatePriority,
};