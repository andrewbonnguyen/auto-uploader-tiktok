# Advanced App Review Description

AutoUploader TikTok is a web-based creator utility tool designed to help users manually upload video content to their own TikTok accounts using TikTok’s official Open API.

The application does not provide automation, scheduling, bulk posting, or engagement manipulation features.

Each upload requires explicit user action.

## Login Kit

OAuth 2.0 authentication.
Scope used:
- user.info.basic

Used only to confirm identity.

## Content Posting API

Users manually submit:
- video URL
- caption

Scope used:
- video.upload

Used strictly for user-initiated uploads.

## Data Handling

- No password storage
- No permanent token storage
- No background uploads
- No data sharing

Fully compliant with TikTok Developer Terms.
