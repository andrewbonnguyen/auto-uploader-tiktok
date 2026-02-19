require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const CLIENT_KEY = process.env.CLIENT_KEY;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const PORT = process.env.PORT || 3000;

/**
 * Health Check
 */
app.get("/", (req, res) => {
  res.json({
    app: "AutoUploader TikTok",
    status: "running"
  });
});

/**
 * STEP 1 – Redirect to TikTok OAuth
 */
app.get("/auth", (req, res) => {
  const authUrl = `https://www.tiktok.com/v2/auth/authorize?client_key=${CLIENT_KEY}&response_type=code&scope=user.info.basic,video.upload&redirect_uri=${REDIRECT_URI}`;
  res.redirect(authUrl);
});

/**
 * STEP 2 – OAuth Callback
 */
app.get("/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  try {
    const tokenResponse = await axios.post(
      "https://open.tiktokapis.com/v2/oauth/token/",
      {
        client_key: CLIENT_KEY,
        client_secret: CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    res.json({
      message: "Authorization successful",
      access_token: accessToken
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Token exchange failed" });
  }
});

/**
 * STEP 3 – Manual Upload
 */
app.post("/upload", async (req, res) => {
  const { access_token, video_url, caption } = req.body;

  if (!access_token || !video_url) {
    return res.status(400).json({
      error: "access_token and video_url are required"
    });
  }

  try {
    const uploadResponse = await axios.post(
      "https://open.tiktokapis.com/v2/post/publish/video/init/",
      {
        source_info: {
          source: "PULL_FROM_URL",
          video_url: video_url
        },
        post_info: {
          title: caption || ""
        }
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(uploadResponse.data);

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
