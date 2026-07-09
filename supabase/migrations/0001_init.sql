-- ============================================================================
-- Retouch Horse Garden — initial schema
-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- for project rqxtefaiwrcpwigzvdmr, or via `supabase db push` if you have the
-- database connection string / access token configured locally.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- profiles: one row per admin user (extends auth.users)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'admin' check (role in ('admin', 'staff')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: self select"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

-- Automatically create a profile row whenever a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email), 'admin')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- site_settings: small key/value config table (max groups per day, contact info…)
-- ----------------------------------------------------------------------------
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

insert into public.site_settings (key, value) values
  ('max_groups_per_day', '4'),
  ('contact_email', '"info@retouch-horsegarden.example.jp"'),
  ('facility_name', '"Retouch Horse Garden"')
on conflict (key) do nothing;

-- ----------------------------------------------------------------------------
-- site_types: RVサイト / フリーサイト
-- ----------------------------------------------------------------------------
create table if not exists public.site_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_ja text not null,
  description text,
  price_per_night numeric(10, 0) not null default 0,
  capacity_people int not null default 4,
  capacity_note text,
  sort_order int not null default 0,
  active boolean not null default true
);

alter table public.site_types enable row level security;

insert into public.site_types (code, name_ja, description, price_per_night, capacity_people, capacity_note, sort_order) values
  ('rv', 'キャンピングカーサイト', '電源付き・愛車のキャンピングカーやトレーラーで滞在。ポニーパドックに隣接。', 12000, 4, '1台まで／それ以上は要相談', 1),
  ('free', 'フリーサイト', 'テント・タープを自由に設営できる芝生サイト。焚き火可。', 8000, 4, 'テント2張まで目安', 2)
on conflict (code) do nothing;

-- ----------------------------------------------------------------------------
-- experience_options: ポニーとのふれあい／餌やり／写真撮影／BBQ など
-- ----------------------------------------------------------------------------
create table if not exists public.experience_options (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_ja text not null,
  description text,
  price numeric(10, 0) not null default 0,
  unit text not null default 'per_group' check (unit in ('per_group', 'per_person')),
  sort_order int not null default 0,
  active boolean not null default true
);

alter table public.experience_options enable row level security;

insert into public.experience_options (code, name_ja, description, price, unit, sort_order) values
  ('pony_fureai', 'ポニーとのふれあい', 'ブラッシングやお散歩など、ポニーと触れ合う体験。', 0, 'per_group', 1),
  ('esayari', '餌やり体験', '馬たちに直接エサをあげる体験。', 1000, 'per_group', 2),
  ('photo', '記念写真撮影', 'カメラマンによるプロ撮影、データ納品。', 3000, 'per_group', 3),
  ('bbq', 'BBQセット', '食材・機材一式のBBQプラン。', 4500, 'per_person', 4)
on conflict (code) do nothing;

-- ----------------------------------------------------------------------------
-- bookings
-- ----------------------------------------------------------------------------
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'cancelled')),

  stay_date date not null,
  nights int not null default 1,
  site_type_id uuid not null references public.site_types (id),

  num_adults int not null default 1,
  num_children int not null default 0,
  num_infants int not null default 0,

  customer_name text not null,
  customer_email text not null,
  customer_phone text,

  -- data-collection fields (for future large-scale-facility planning)
  region text,
  group_type text check (group_type in ('family', 'couple', 'friends', 'solo', 'other')),
  purpose text,
  desired_experience text[] not null default '{}',
  stay_style text,
  referral_source text,
  repeat_intention text,

  notes text,
  admin_memo text,
  total_price numeric(10, 0) not null default 0,

  cancel_token uuid not null default gen_random_uuid(),
  approved_at timestamptz,
  approved_by uuid references public.profiles (id),
  cancelled_at timestamptz
);

create index if not exists bookings_stay_date_idx on public.bookings (stay_date);
create index if not exists bookings_status_idx on public.bookings (status);
create unique index if not exists bookings_cancel_token_idx on public.bookings (cancel_token);

alter table public.bookings enable row level security;
-- No anon/authenticated policies: all reads/writes to bookings go through
-- server-side Next.js route handlers using the Supabase service-role key.

-- ----------------------------------------------------------------------------
-- booking_options: line items chosen per booking
-- ----------------------------------------------------------------------------
create table if not exists public.booking_options (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  option_id uuid not null references public.experience_options (id),
  quantity int not null default 1,
  unit_price numeric(10, 0) not null default 0
);

create index if not exists booking_options_booking_id_idx on public.booking_options (booking_id);

alter table public.booking_options enable row level security;

-- ----------------------------------------------------------------------------
-- surveys: post-stay satisfaction survey, one per booking
-- ----------------------------------------------------------------------------
create table if not exists public.surveys (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings (id) on delete cascade,
  token uuid not null default gen_random_uuid(),

  sent_at timestamptz,
  responded_at timestamptz,

  satisfaction_score int check (satisfaction_score between 1 and 5),
  memorable_experience text,
  improvement_points text,
  revisit_intention text,
  review_ok boolean,
  review_text text,
  large_facility_wishes text,

  ai_summary text,
  ai_tags text[] not null default '{}'
);

create unique index if not exists surveys_token_idx on public.surveys (token);

alter table public.surveys enable row level security;

-- ----------------------------------------------------------------------------
-- reviews: curated/published excerpts from surveys, shown on the public site
-- ----------------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid references public.surveys (id) on delete set null,
  booking_id uuid references public.bookings (id) on delete set null,
  display_name text not null default 'ゲスト',
  content text not null,
  rating int check (rating between 1 and 5),
  published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "reviews: public can read published reviews"
  on public.reviews for select
  to anon, authenticated
  using (published = true);

-- ----------------------------------------------------------------------------
-- contact_messages: general inquiry form
-- ----------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  handled boolean not null default false
);

alter table public.contact_messages enable row level security;

-- ----------------------------------------------------------------------------
-- updated_at trigger for bookings
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute procedure public.set_updated_at();
