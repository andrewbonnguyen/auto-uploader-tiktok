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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
