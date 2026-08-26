const calculateComplaintPriority = ({
  title,
  description,
  category,
}) => {
  const text = `${title} ${description}`.toLowerCase();

  let score = 10;
  const reasons = [];

  // Emergency keywords
  const urgentKeywords = [
    "fire",
    "accident",
    "emergency",
    "danger",
    "security",
    "electric shock",
    "threat",
  ];

  const urgentFound = urgentKeywords.some((keyword) =>
    text.includes(keyword)
  );

  if (urgentFound) {
    score += 60;
    reasons.push("Emergency-related issue");
  }

  // Academic deadline
  const academicKeywords = [
    "exam",
    "practical",
    "assignment",
    "deadline",
    "placement",
    "interview",
  ];

  const academicUrgency = academicKeywords.some((keyword) =>
    text.includes(keyword)
  );

  if (academicUrgency) {
    score += 20;
    reasons.push("Academic or career deadline involved");
  }

  // Multiple-user impact
  const impactKeywords = [
    "all students",
    "many students",
    "whole class",
    "entire lab",
    "everyone",
    "multiple students",
  ];

  const highImpact = impactKeywords.some((keyword) =>
    text.includes(keyword)
  );

  if (highImpact) {
    score += 20;
    reasons.push("Potentially affects multiple students");
  }

  // Category boost
  if (category === "security") {
    score += 20;
    reasons.push("Security-related complaint");
  }

  if (category === "infrastructure") {
    score += 10;
    reasons.push("Infrastructure issue");
  }

  // Maximum score
  score = Math.min(score, 100);

  let priority = "low";

  if (score >= 80) {
    priority = "urgent";
  } else if (score >= 60) {
    priority = "high";
  } else if (score >= 35) {
    priority = "medium";
  }

  return {
    priority,
    priorityScore: score,
    priorityReason:
      reasons.length > 0
        ? reasons.join(" + ")
        : "Normal campus complaint",
  };
};

module.exports = calculateComplaintPriority;