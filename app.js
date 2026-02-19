const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Disable cache for verification files
app.use((req, res, next) => {
  if (req.url.endsWith(".txt")) {
    res.setHeader("Cache-Control", "no-store");
  }
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Root route
app.get("/", (req, res) => {
  res.send("Auto Uploader TikTok Running");
});

// Terms of Service
app.get("/terms", (req, res) => {
  res.send(`
    <h1>Terms of Service</h1>
    <p>This application allows users to upload videos to their own TikTok accounts using official TikTok APIs.</p>
    <p>Users are fully responsible for the content they upload.</p>
    <p>We do not store user passwords or sell personal data.</p>
  `);
});

// Privacy Policy
app.get("/privacy", (req, res) => {
  res.send(`
    <h1>Privacy Policy</h1>
    <p>This application uses TikTok OAuth to authenticate users.</p>
    <p>We do not store TikTok passwords.</p>
    <p>Access tokens are used only for uploading content authorized by the user.</p>
    <p>No personal data is sold or shared with third parties.</p>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
