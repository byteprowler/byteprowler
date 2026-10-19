-- Run once in Supabase SQL Editor. Preserves aggregate and earlier event totals.
begin;
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='portfolio_views' and column_name='visitor_id') then
    alter table public.portfolio_views rename to portfolio_view_events_archive;
  end if;
end $$;
create table if not exists public.portfolio_views (
  id text primary key,
  count bigint not null default 0,
  updated_at timestamptz not null default now()
);
do $$
declare baseline bigint := 0; events bigint := 0;
begin
  if to_regclass('public.portfolio_view_totals_legacy') is not null then
    select coalesce(sum(count),0) into baseline from public.portfolio_view_totals_legacy;
  end if;
  if to_regclass('public.portfolio_view_events_archive') is not null then
    select count(*) into events from public.portfolio_view_events_archive;
  end if;
  insert into public.portfolio_views(id,count) values ('byteprowler:portfolio:views',baseline+events) on conflict(id) do nothing;
end $$;
create table if not exists public.portfolio_visit_windows (
  token text primary key,
  expires_at timestamptz not null
);
alter table public.portfolio_views enable row level security;
alter table public.portfolio_visit_windows enable row level security;
revoke all on public.portfolio_views, public.portfolio_visit_windows from anon, authenticated;
grant all on public.portfolio_views, public.portfolio_visit_windows to service_role;
create or replace function public.record_portfolio_visit(view_id text, visit_token text)
returns table(total bigint, counted boolean)
language plpgsql security definer set search_path = public as $$
declare inserted integer;
begin
  if visit_token !~ '^[a-zA-Z0-9_-]{20,128}$' then raise exception 'Invalid visit token'; end if;
  -- Unique token insertion serializes simultaneous retries across server instances.
  delete from public.portfolio_visit_windows where expires_at < now();
  insert into public.portfolio_visit_windows(token,expires_at) values(visit_token,now()+interval '6 hours') on conflict do nothing;
  get diagnostics inserted = row_count;
  insert into public.portfolio_views(id,count) values(view_id,0) on conflict do nothing;
  if inserted = 1 then
    update public.portfolio_views set count=count+1,updated_at=now() where id=view_id;
  end if;
  return query select v.count, inserted=1 from public.portfolio_views v where v.id=view_id;
end $$;
revoke all on function public.record_portfolio_visit(text,text) from public, anon, authenticated;
grant execute on function public.record_portfolio_visit(text,text) to service_role;
-- Retire the unguarded legacy increment endpoint.
do $$ begin
  if to_regprocedure('public.increment_portfolio_view(text)') is not null then
    revoke all on function public.increment_portfolio_view(text) from public, anon, authenticated;
  end if;
end $$;
commit;
