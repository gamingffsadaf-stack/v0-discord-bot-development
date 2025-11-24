-- Create locked channels table to track channel lock history
create table if not exists public.locked_channels (
  id uuid primary key default gen_random_uuid(),
  guild_id text not null references public.guilds(id) on delete cascade,
  channel_id text not null,
  channel_name text not null,
  locked_by text not null,
  locked_at timestamptz default now(),
  unlocked_by text,
  unlocked_at timestamptz,
  reason text,
  status text default 'locked' check (status in ('locked', 'unlocked'))
);

-- Enable RLS
alter table public.locked_channels enable row level security;

-- Policies for locked_channels
create policy "locked_channels_select_all"
  on public.locked_channels for select
  using (true);

create policy "locked_channels_insert_all"
  on public.locked_channels for insert
  with check (true);

create policy "locked_channels_update_all"
  on public.locked_channels for update
  using (true);

-- Create index for faster queries
create index idx_locked_channels_guild_id on public.locked_channels(guild_id);
