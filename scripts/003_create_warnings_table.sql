-- Create warnings table to store user warnings
create table if not exists public.warnings (
  id uuid primary key default gen_random_uuid(),
  guild_id text not null references public.guilds(id) on delete cascade,
  user_id text not null,
  user_tag text not null,
  moderator_id text not null,
  moderator_tag text not null,
  reason text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.warnings enable row level security;

-- Policies for warnings
create policy "warnings_select_all"
  on public.warnings for select
  using (true);

create policy "warnings_insert_all"
  on public.warnings for insert
  with check (true);

create policy "warnings_delete_all"
  on public.warnings for delete
  using (true);

-- Create index for faster queries
create index idx_warnings_guild_id on public.warnings(guild_id);
create index idx_warnings_user_id on public.warnings(user_id);
