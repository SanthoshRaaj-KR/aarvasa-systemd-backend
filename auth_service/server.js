const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const connectDB = require("./config/db");
const helmet = require("helmet");
const cors = require("cors");

dotenv.config();
connectDB();

require("./config/passport");

const app = express();
app.use(helmet());

// ✅ Setup CORS first (before any route/middleware that uses cookies or headers)
app.use(cors({
  origin: process.env.FRONTEND_URL, // e.g., "https://aarvasa-nine.vercel.app"
  credentials: true
}));

// ✅ Accept JSON payloads
app.use(express.json());

// ✅ Session middleware (used by passport)
app.use(session({
  secret: "otpsecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,          // true if using HTTPS
    httpOnly: true,
    sameSite: "lax"         // or "none" if you're on HTTPS + cross-site
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ Define your routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/chatbot", require("./routes/chatbot"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
