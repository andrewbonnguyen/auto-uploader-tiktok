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
 * =========================
 * BASIC LANDING PAGE
 * =========================
 */
app.get("/", (req, res) => {
  res.send(`
    <h1>AutoUploader TikTok</h1>
    <p>Status: Running</p>
    <p><a href="/auth">Login with TikTok</a></p>
    <p><a href="/terms">Terms of Service</a></p>
    <p><a href="/privacy">Privacy Policy</a></p>
  `);
});

/**
 * =========================
 * TIKTOK VERIFY ROUTE
 * =========================
 * Replace VERIFY_CODE with the exact content TikTok gives you
 */
// TikTok verify (handle both with and without trailing slash)
app.get(["/tiktok_verify.txt", "/tiktok_verify.txt/"], (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(
    "tiktok-developers-site-verification=O56HDcGn59vIYWsl8e5X6xlVWcU7AdLY"
  );
});

/**
 * =========================
 * TERMS ROUTE
 * =========================
 */
app.get("/terms", (req, res) => {
  res.send(`
    <h2>Terms of Service</h2>
    <p>This application allows users to upload videos to their own TikTok accounts using the official TikTok Open API.</p>
    <p>Users are responsible for the content they upload.</p>
  `);
});

/**
 * =========================
 * PRIVACY ROUTE
 * =========================
 */
app.get("/privacy", (req, res) => {
  res.send(`
    <h2>Privacy Policy</h2>
    <p>This app uses TikTok OAuth to authenticate users.</p>
    <p>No passwords are stored.</p>
    <p>No permanent token storage.</p>
    <p>No third-party data sharing.</p>
  `);
});

/**
 * =========================
 * STEP 1 – OAuth Login
 * =========================
 */
app.get("/auth", (req, res) => {
  const authUrl = `https://www.tiktok.com/v2/auth/authorize?client_key=${CLIENT_KEY}&response_type=code&scope=user.info.basic,video.upload&redirect_uri=${REDIRECT_URI}`;
  res.redirect(authUrl);
});

/**
 * =========================
 * STEP 2 – OAuth Callback
 * =========================
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
 * =========================
 * STEP 3 – Manual Upload
 * =========================
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
