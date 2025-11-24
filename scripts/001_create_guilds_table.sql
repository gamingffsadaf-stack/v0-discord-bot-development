-- Create guilds table to store Discord server configurations
create table if not exists public.guilds (
  id text primary key, -- Discord guild ID
  name text not null,
  icon text,
  owner_id text not null,
  prefix text default '!',
  language text default 'bn',
  welcome_channel_id text,
  log_channel_id text,
  ticket_category_id text,
  ticket_counter int default 0,
  auto_reply_enabled boolean default false,
  dm_protection_enabled boolean default true,
  profanity_filter_enabled boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.guilds enable row level security;

-- Policies for guilds
create policy "guilds_select_all"
  on public.guilds for select
  using (true);

create policy "guilds_insert_owner"
  on public.guilds for insert
  with check (true);

create policy "guilds_update_owner"
  on public.guilds for update
  using (true);
