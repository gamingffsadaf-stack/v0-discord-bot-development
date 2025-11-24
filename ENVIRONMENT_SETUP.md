# Environment Variables Setup Guide

This guide will help you set up all required environment variables for the SadafGuard Discord bot.

## Required Variables

Add these variables in the **Vars** section of the v0 sidebar:

### 1. DISCORD_BOT_TOKEN

**What it is:** Your Discord bot's authentication token

**How to get it:**
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click on your application (or create a new one)
3. Go to the **Bot** section in the left sidebar
4. Under "Token", click **Reset Token** (or **Copy** if this is your first time)
5. Copy the token - you won't be able to see it again!

**Important:** Enable these Privileged Gateway Intents in the Bot section:
- ✅ Server Members Intent
- ✅ Message Content Intent

**Example:**
\`\`\`
DISCORD_BOT_TOKEN=MTIzNDU2Nzg5MDEyMzQ1Njc4.GhIjKl.MnOpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWx
\`\`\`

---

### 2. DISCORD_CLIENT_ID

**What it is:** Your Discord application's unique identifier

**How to get it:**
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click on your application
3. Go to **General Information** section
4. Copy the **Application ID**

**Example:**
\`\`\`
DISCORD_CLIENT_ID=1234567890123456789
\`\`\`

---

### 3. DISCORD_CLIENT_SECRET

**What it is:** Your Discord application's OAuth2 secret

**How to get it:**
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click on your application
3. Go to **OAuth2** section in the left sidebar
4. Under "Client Secret", click **Reset Secret** (or **Copy**)
5. Copy the secret

**Example:**
\`\`\`
DISCORD_CLIENT_SECRET=abCdEfGhIjKlMnOpQrStUvWxYz123456
\`\`\`

---

### 4. NEXT_PUBLIC_DISCORD_BOT_INVITE_URL

**What it is:** The URL users will use to invite your bot to their servers

**How to create it:**

Use this template and replace `YOUR_CLIENT_ID` with your actual Discord Client ID:

\`\`\`
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
\`\`\`

**Permissions Breakdown:**
- `permissions=8` = Administrator (recommended for full functionality)
- `scope=bot%20applications.commands` = Bot with slash commands

**Alternative with specific permissions:**
If you don't want to give Administrator, use this URL with specific permissions:
\`\`\`
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=1099780063414&scope=bot%20applications.commands
\`\`\`

**Example:**
\`\`\`
NEXT_PUBLIC_DISCORD_BOT_INVITE_URL=https://discord.com/api/oauth2/authorize?client_id=1234567890123456789&permissions=8&scope=bot%20applications.commands
\`\`\`

---

## Adding Variables in v0

1. Click on the **Vars** section in the left sidebar
2. Click **Add Variable**
3. Enter the variable name (e.g., `DISCORD_BOT_TOKEN`)
4. Paste the value
5. Click **Save**
6. Repeat for all four variables

---

## Verification

After adding all variables:

1. Go to your dashboard at `/dashboard`
2. You should see a green "Bot Configured" status
3. Click "Start Bot" to launch the bot
4. The bot should come online in Discord

---

## Troubleshooting

### "Missing required Discord environment variables"

Make sure all four variables are added:
- DISCORD_BOT_TOKEN
- DISCORD_CLIENT_ID
- DISCORD_CLIENT_SECRET
- NEXT_PUBLIC_DISCORD_BOT_INVITE_URL

### "Failed to start bot"

1. Check that your bot token is correct (no extra spaces)
2. Verify Privileged Gateway Intents are enabled
3. Make sure the token hasn't been reset in the Discord portal

### "Bot goes offline immediately"

1. Check the bot token is valid
2. Ensure intents are enabled in Discord Developer Portal
3. Look at the console for error messages

---

## Security Notes

- **Never share your bot token publicly**
- If your token is exposed, reset it immediately in the Discord Developer Portal
- The `NEXT_PUBLIC_` prefix means the variable is visible in the browser - only use it for non-sensitive data like the invite URL
- Keep your client secret private
