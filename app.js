const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON & form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 Serve static files from /public folder
app.use(express.static(path.join(__dirname, "public")));

// Root route
app.get("/", (req, res) => {
  res.status(200).send("Auto Uploader TikTok App Running");
});

// Optional: OAuth callback route
app.get("/callback", (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).send("Missing authorization code");
  }

  res.status(200).json({
    message: "Callback received successfully",
    code,
    state: state || null
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
