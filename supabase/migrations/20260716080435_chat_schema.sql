-- Chatbot lead intake + server-side rate limiting for the "chat" edge function.
-- Both tables are written exclusively by the edge function via the service-role key,
-- which bypasses RLS -- RLS is enabled with no policies so the public anon key
-- (shipped to the browser) can never read or write these tables directly.

create table if not exists chat_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  category text,
  specs text,
  contact_name text,
  contact_email text,
  contact_company text,
  urgency_note text,
  transcript jsonb not null default '[]'::jsonb,
  escalated_early boolean not null default false,
  status text not null default 'new'
);

alter table chat_leads enable row level security;

create table if not exists chat_rate_limits (
  key text primary key,
  window_start timestamptz not null default now(),
  count integer not null default 1
);

alter table chat_rate_limits enable row level security;

-- Atomically increments (or resets, if the window has elapsed) the counter for `p_key`
-- and reports whether the caller is still within `p_limit` for the current window.
-- Called only by the edge function via the service-role key, which bypasses RLS.
create or replace function check_and_increment_rate_limit(
  p_key text,
  p_window_seconds integer,
  p_limit integer
) returns boolean
language plpgsql
as $$
declare
  v_count integer;
begin
  insert into chat_rate_limits (key, window_start, count)
  values (p_key, now(), 1)
  on conflict (key) do update
    set count = case
          when chat_rate_limits.window_start < now() - (p_window_seconds || ' seconds')::interval
            then 1
          else chat_rate_limits.count + 1
        end,
        window_start = case
          when chat_rate_limits.window_start < now() - (p_window_seconds || ' seconds')::interval
            then now()
          else chat_rate_limits.window_start
        end
  returning count into v_count;

  return v_count <= p_limit;
end;
$$;
