# SadafGuard Bot - Quick Start Guide

## ✅ Environment Variables Configured

Your Discord bot credentials have been successfully added to the project:

- ✅ `DISCORD_BOT_TOKEN`
- ✅ `DISCORD_CLIENT_ID`
- ✅ `DISCORD_CLIENT_SECRET`
- ✅ `NEXT_PUBLIC_DISCORD_BOT_INVITE_URL`

The Supabase integration is also connected with database tables ready.

## 🚀 Next Steps

### 1. Run the SQL Scripts

Execute the database migration scripts in order:
- `scripts/001_create_guilds_table.sql`
- `scripts/002_create_tickets_table.sql`
- `scripts/003_create_warnings_table.sql`
- `scripts/004_create_logs_table.sql`
- `scripts/005_create_auto_replies_table.sql`
- `scripts/006_create_locked_channels_table.sql`

You can run these directly in v0 or through the Supabase dashboard SQL editor.

### 2. Invite the Bot to Your Server

Click the invite link or visit:
\`\`\`
https://discord.com/oauth2/authorize?client_id=1433062383844327434
\`\`\`

Make sure to grant the bot **Administrator** permissions or at minimum:
- Manage Channels
- Manage Roles
- Kick Members
- Ban Members
- Moderate Members (Timeout)
- Manage Messages
- Send Messages
- View Channels

### 3. Start the Bot

Option A: **From the Dashboard (Recommended)**
1. Visit the home page at `/`
2. Click "Start Bot" button
3. The bot will initialize and register slash commands

Option B: **API Call**
\`\`\`bash
curl -X POST http://localhost:3000/api/bot/start
\`\`\`

### 4. Setup Your Server

In your Discord server, run:
\`\`\`
/setup
\`\`\`

This will:
- Register your server in the database
- Create necessary configuration
- Prepare the bot for use

### 5. Test the Bot

Try these commands in your Discord server:

**Tickets:**
\`\`\`
/ticket open subject:Need help with something
/ticket close
\`\`\`

**Warnings:**
\`\`\`
/warn add user:@someone reason:Breaking rules
/warn list user:@someone
\`\`\`

**Moderation:**
\`\`\`
/mod kick user:@someone reason:Spam
/mod ban user:@someone reason:Severe violation
/mod timeout user:@someone duration:10m reason:Cooldown
\`\`\`

**Channel Management:**
\`\`\`
/channel lock channel:#general reason:Maintenance
/channel unlock channel:#general
/channel slowmode channel:#general duration:5s
\`\`\`

**Role Management:**
\`\`\`
/role add user:@someone role:@Member
/role remove user:@someone role:@Member
/role info role:@Member
\`\`\`

**Auto-Replies:**
\`\`\`
/autoreply add trigger:hello response:Welcome to the server!
/autoreply list
/autoreply remove id:1
\`\`\`

### 6. Access the Dashboard

Visit `/dashboard` to:
- View all tickets, warnings, and logs
- Manage server settings
- Configure auto-replies
- Monitor bot activity

## 🔒 Security Note

**IMPORTANT:** The bot token and client secret shown in this chat are sensitive credentials. For production use:

1. Keep these credentials private
2. Regenerate tokens if they are exposed publicly
3. Use Discord Developer Portal to manage bot settings
4. Enable 2FA on your Discord account

## 🛠️ Troubleshooting

**Bot not responding:**
- Check if bot is online in Discord (green status)
- Verify bot has proper permissions in your server
- Check the bot status on the dashboard at `/`

**Commands not showing:**
- Wait a few minutes for Discord to register slash commands
- Try kicking and re-inviting the bot
- Run `/setup` command again

**Database errors:**
- Ensure all SQL scripts have been executed
- Check Supabase connection in the Connect sidebar
- Verify RLS policies are enabled on tables

## 📚 Full Documentation

For detailed information about all features, see:
- `README.md` - Complete feature list and architecture
- `ENVIRONMENT_SETUP.md` - How to get Discord credentials
- Database schema in `scripts/*.sql` files

## 🆘 Support

If you encounter issues:
1. Check browser console for errors
2. Verify all environment variables are set correctly
3. Ensure database tables are created
4. Check bot permissions in Discord server settings
