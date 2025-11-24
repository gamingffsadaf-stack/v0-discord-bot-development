-- Create auto replies table
create table if not exists public.auto_replies (
  id uuid primary key default gen_random_uuid(),
  guild_id text not null references public.guilds(id) on delete cascade,
  trigger_text text not null,
  reply_text text not null,
  enabled boolean default true,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.auto_replies enable row level security;

-- Policies for auto_replies
create policy "auto_replies_select_all"
  on public.auto_replies for select
  using (true);

create policy "auto_replies_insert_all"
  on public.auto_replies for insert
  with check (true);

create policy "auto_replies_update_all"
  on public.auto_replies for update
  using (true);

create policy "auto_replies_delete_all"
  on public.auto_replies for delete
  using (true);

-- Create index for faster queries
create index idx_auto_replies_guild_id on public.auto_replies(guild_id);
