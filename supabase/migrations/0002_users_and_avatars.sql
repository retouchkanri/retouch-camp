-- ============================================================================
-- Retouch Horse Garden — customer accounts, avatars, admin role hardening
-- Run this once in the Supabase SQL Editor after 0001_init.sql.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- profiles: allow a 'customer' role, track email + avatar
-- ----------------------------------------------------------------------------
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists avatar_url text;

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('admin', 'staff', 'customer'));
alter table public.profiles alter column role set default 'customer';

-- Backfill email for any profiles created before this column existed.
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id and p.email is null;

-- ----------------------------------------------------------------------------
-- handle_new_user: default new signups to 'customer'. Role can only be
-- elevated via raw_app_meta_data, which is exclusively writable by the
-- service-role key (never by the public signUp() client call) — so a public
-- sign-up can never grant itself admin/staff.
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.email,
    coalesce(new.raw_app_meta_data ->> 'role', 'customer')
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- bookings: link to the logged-in account that made the booking (nullable —
-- guest checkout without an account is still supported)
-- ----------------------------------------------------------------------------
alter table public.bookings add column if not exists user_id uuid references auth.users (id) on delete set null;
create index if not exists bookings_user_id_idx on public.bookings (user_id);

-- ----------------------------------------------------------------------------
-- avatars storage bucket: public read, users can only write inside their own
-- "<uid>/…" folder
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatars: public read" on storage.objects;
create policy "avatars: public read"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

drop policy if exists "avatars: owner insert" on storage.objects;
create policy "avatars: owner insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatars: owner update" on storage.objects;
create policy "avatars: owner update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatars: owner delete" on storage.objects;
create policy "avatars: owner delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
