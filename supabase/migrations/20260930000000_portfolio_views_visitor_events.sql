-- Portfolio view tracking v2.
-- Stores anonymous visitor events only: no IP addresses, names, emails, or contact content.
-- If the legacy aggregate table exists with id/count/updated_at, keep it as a backup.

create extension if not exists pgcrypto;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'portfolio_views'
      and column_name = 'count'
  ) and not exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'portfolio_view_totals_legacy'
  ) then
    alter table public.portfolio_views rename to portfolio_view_totals_legacy;
  end if;
end $$;

create table if not exists public.portfolio_views (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  page_path text not null default '/',
  created_at timestamptz not null default now()
);

create index if not exists portfolio_views_created_at_idx
  on public.portfolio_views (created_at desc);

create index if not exists portfolio_views_visitor_page_created_idx
  on public.portfolio_views (visitor_id, page_path, created_at desc);

alter table public.portfolio_views enable row level security;
