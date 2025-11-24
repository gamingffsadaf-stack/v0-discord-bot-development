-- Create tickets table to store support tickets
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  guild_id text not null references public.guilds(id) on delete cascade,
  channel_id text not null unique,
  ticket_number int not null,
  user_id text not null,
  user_tag text not null,
  status text default 'open' check (status in ('open', 'closed')),
  category text,
  created_at timestamptz default now(),
  closed_at timestamptz,
  closed_by text
);

-- Enable RLS
alter table public.tickets enable row level security;

-- Policies for tickets
create policy "tickets_select_all"
  on public.tickets for select
  using (true);

create policy "tickets_insert_all"
  on public.tickets for insert
  with check (true);

create policy "tickets_update_all"
  on public.tickets for update
  using (true);

create policy "tickets_delete_all"
  on public.tickets for delete
  using (true);

-- Create index for faster queries
create index idx_tickets_guild_id on public.tickets(guild_id);
create index idx_tickets_status on public.tickets(status);
