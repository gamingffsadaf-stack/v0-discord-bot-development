# SadafGuard - Discord Moderation Bot & Dashboard

A powerful Discord moderation bot with a futuristic neon-themed web dashboard.

## 🚀 Features

- **Ticket System** - Create and manage support tickets
- **Warning System** - Track user warnings with automatic actions
- **Moderation Tools** - Kick, ban, timeout, and role management
- **Channel Management** - Lock/unlock channels and set slowmode
- **Auto-Reply** - Custom automated responses
- **Security** - Profanity filter and DM protection
- **Web Dashboard** - Beautiful neon cyberpunk themed interface

## 🔧 Required Environment Variables

You need to add these environment variables in the **Vars** section of the sidebar:

### Discord Bot Configuration

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `DISCORD_BOT_TOKEN` | Your Discord bot token | [Discord Developer Portal](https://discord.com/developers/applications) → Your App → Bot → Token |
| `DISCORD_CLIENT_ID` | Your Discord application client ID | Discord Developer Portal → Your App → General Information → Application ID |
| `DISCORD_CLIENT_SECRET` | Your Discord application client secret | Discord Developer Portal → Your App → OAuth2 → Client Secret |
| `NEXT_PUBLIC_DISCORD_BOT_INVITE_URL` | Bot invite URL | Use format: `https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands` |

### Supabase (Already Configured)

The Supabase integration is already connected with these variables:
- `SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_ANON_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 📋 Setup Instructions

### 1. Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name (e.g., "SadafGuard")
3. Go to the **Bot** section:
   - Click "Add Bot"
   - Enable these Privileged Gateway Intents:
     - ✅ Server Members Intent
     - ✅ Message Content Intent
   - Copy the **Bot Token** (you'll need this for `DISCORD_BOT_TOKEN`)
4. Go to **General Information**:
   - Copy the **Application ID** (this is your `DISCORD_CLIENT_ID`)
5. Go to **OAuth2**:
   - Copy the **Client Secret** (this is your `DISCORD_CLIENT_SECRET`)
   - Add this Redirect URL: `https://your-dashboard-url.vercel.app/auth/callback`

### 2. Run Database Migrations

The SQL scripts in the `/scripts` folder need to be executed. Click the "Run" button next to each script file in order:

1. `001_create_guilds_table.sql`
2. `002_create_tickets_table.sql`
3. `003_create_warnings_table.sql`
4. `004_create_logs_table.sql`
5. `005_create_auto_replies_table.sql`
6. `006_create_locked_channels_table.sql`

### 3. Add Environment Variables

In the **Vars** section of the sidebar, add:

\`\`\`
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_DISCORD_BOT_INVITE_URL=https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
\`\`\`

Replace the placeholders with your actual values from Step 1.

### 4. Start the Bot

Once deployed, the bot will automatically start. To manually trigger it, visit:
\`\`\`
https://your-dashboard-url.vercel.app/api/bot/start
\`\`\`

### 5. Invite Bot to Your Server

Use the invite URL from `NEXT_PUBLIC_DISCORD_BOT_INVITE_URL` to add the bot to your Discord server.

### 6. Initialize Server

In your Discord server, run:
\`\`\`
/setup
\`\`\`

This will create the initial configuration in the database.

## 🎮 Discord Commands

### Ticket Management
- `/ticket create [reason]` - Create a support ticket
- `/ticket close` - Close the current ticket

### Warning System
- `/warn add @user [reason]` - Warn a user
- `/warn list @user` - View user's warnings
- `/warn remove [warning_id]` - Remove a warning

### Moderation
- `/mod kick @user [reason]` - Kick a user
- `/mod ban @user [reason]` - Ban a user
- `/mod unban [user_id]` - Unban a user
- `/mod timeout @user [duration] [reason]` - Timeout a user

### Channel Management
- `/channel lock [#channel]` - Lock a channel
- `/channel unlock [#channel]` - Unlock a channel
- `/channel slowmode [#channel] [seconds]` - Set slowmode

### Role Management
- `/role add @user @role` - Add role to user
- `/role remove @user @role` - Remove role from user
- `/role info @role` - Get role information
- `/role members @role` - List role members

### Auto-Reply
- `/autoreply add [trigger] [response]` - Add auto-reply
- `/autoreply list` - List all auto-replies
- `/autoreply remove [id]` - Remove auto-reply

## 🌐 Dashboard Pages

- **Home** (`/`) - Landing page with bot features
- **Dashboard** (`/dashboard`) - Server selection and overview
- **Tickets** (`/dashboard/[guildId]/tickets`) - Manage support tickets
- **Warnings** (`/dashboard/[guildId]/warnings`) - View warning history
- **Logs** (`/dashboard/[guildId]/logs`) - Moderation action logs
- **Settings** (`/dashboard/[guildId]/settings`) - Configure bot settings

## 🎨 Design Theme

The dashboard features a **neon cyberpunk** aesthetic with:
- Dark backgrounds with particle animations
- Cyan to magenta gradient accents
- Glassmorphism cards with backdrop blur
- Neon glow effects on interactive elements
- Smooth animations and transitions

## 🔒 Security Features

- **Profanity Filter** - Automatically removes inappropriate content
- **Row Level Security** - All database tables protected with RLS
- **Action Logging** - All moderation actions are logged
- **Permission Checks** - Commands require appropriate Discord permissions

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19.2, TailwindCSS v4
- **Backend**: Discord.js v14, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Deployment**: Vercel

## 📝 License

MIT License - Feel free to use and modify for your own servers!
