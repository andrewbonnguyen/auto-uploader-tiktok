const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (VERY IMPORTANT for TikTok verification)
app.use(express.static(path.join(__dirname, "public")));

// Health check route
app.get("/", (req, res) => {
  res.status(200).send("Auto Uploader TikTok App Running");
});

// TikTok OAuth callback placeholder
app.get("/callback", (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).send("Missing authorization code");
  }

  // In real production you would exchange code for access_token here
  res.status(200).json({
    message: "OAuth callback received successfully",
    code: code,
    state: state || null
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
