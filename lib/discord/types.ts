export interface Guild {
  id: string
  name: string
  icon: string | null
  owner_id: string
  prefix: string
  language: string
  welcome_channel_id: string | null
  log_channel_id: string | null
  ticket_category_id: string | null
  ticket_counter: number
  auto_reply_enabled: boolean
  dm_protection_enabled: boolean
  profanity_filter_enabled: boolean
  created_at: string
  updated_at: string
}

export interface Ticket {
  id: string
  guild_id: string
  channel_id: string
  ticket_number: number
  user_id: string
  user_tag: string
  status: "open" | "closed"
  category: string | null
  created_at: string
  closed_at: string | null
  closed_by: string | null
}

export interface Warning {
  id: string
  guild_id: string
  user_id: string
  user_tag: string
  moderator_id: string
  moderator_tag: string
  reason: string
  created_at: string
}

export interface ModLog {
  id: string
  guild_id: string
  action_type: string
  moderator_id: string
  moderator_tag: string
  target_user_id: string | null
  target_user_tag: string | null
  reason: string | null
  details: Record<string, any> | null
  created_at: string
}

export interface AutoReply {
  id: string
  guild_id: string
  trigger_text: string
  reply_text: string
  enabled: boolean
  created_at: string
}

export interface LockedChannel {
  id: string
  guild_id: string
  channel_id: string
  channel_name: string
  locked_by: string
  locked_at: string
  unlocked_by: string | null
  unlocked_at: string | null
  reason: string | null
  status: "locked" | "unlocked"
}
