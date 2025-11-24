-- Create moderation logs table
create table if not exists public.mod_logs (
  id uuid primary key default gen_random_uuid(),
  guild_id text not null references public.guilds(id) on delete cascade,
  action_type text not null,
  moderator_id text not null,
  moderator_tag text not null,
  target_user_id text,
  target_user_tag text,
  reason text,
  details jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.mod_logs enable row level security;

-- Policies for mod_logs
create policy "mod_logs_select_all"
  on public.mod_logs for select
  using (true);

create policy "mod_logs_insert_all"
  on public.mod_logs for insert
  with check (true);

-- Create index for faster queries
create index idx_mod_logs_guild_id on public.mod_logs(guild_id);
create index idx_mod_logs_created_at on public.mod_logs(created_at desc);
