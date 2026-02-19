# AutoUploader TikTok

AutoUploader TikTok is a simple web-based utility tool that allows users to manually upload videos to their own TikTok account using TikTok’s official Open API.

## Features

- TikTok OAuth 2.0 Login
- Manual video upload
- No automation
- No scheduling
- No token storage
- No background posting

## Setup

1. Create a TikTok Developer App
2. Add products:
   - Login Kit
   - Content Posting API
3. Add scopes:
   - user.info.basic
   - video.upload

## Environment Setup

Create a .env file:

CLIENT_KEY=my_client_key
CLIENT_SECRET=my_client_secret
REDIRECT_URI=http://localhost:3000/callback

## Install

npm install

## Run

npm start

Server runs at:

http://localhost:3000
