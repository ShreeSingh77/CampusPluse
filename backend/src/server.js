const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");


const lostFoundRoutes = require("./routes/lostFound.routes");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const announcementRoutes = require("./routes/announcement.routes");
const eventRoutes = require("./routes/event.routes");

dotenv.config();

const app = express();

// Security
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use(limiter);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/events", eventRoutes);
app.use(
  "/api/lost-found",
  lostFoundRoutes
);
// Database
connectDB();

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CampusPulse API is running 🚀",
  });
});


// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CampusPulse Server running on port ${PORT}`);
});