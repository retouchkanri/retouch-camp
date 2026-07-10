-- ============================================================================
-- 0003: Atomic, multi-night booking capacity enforcement
--
-- Fixes two correctness holes in the original availability check, which lived
-- only in application code (check-then-insert, no lock):
--   1. TOCTOU race — two concurrent requests for the last remaining slot both
--      passed the app-side check and both inserted, exceeding the daily cap.
--   2. Multi-night stays only counted against capacity on their first night;
--      nights 2..N stayed bookable by other groups.
--
-- A BEFORE INSERT trigger takes a per-night advisory lock (nights in ascending
-- order, so concurrent inserts cannot deadlock), then counts every active
-- booking whose stay range overlaps that night. If any night is full the
-- insert fails with 'BOOKING_CAPACITY_FULL', which the app maps to a 409.
--
-- No UPDATE trigger is needed: the app only ever transitions status toward
-- inactive (pending -> approved keeps the row counted; rejected/cancelled
-- release capacity).
--
-- Run manually in the Supabase SQL Editor (same as 0001/0002).
-- ============================================================================

create or replace function public.enforce_booking_capacity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  max_groups int;
  night date;
  used int;
begin
  if new.status not in ('pending', 'approved') then
    return new;
  end if;

  select (value #>> '{}')::int
    into max_groups
    from public.site_settings
    where key = 'max_groups_per_day';
  if max_groups is null then
    max_groups := 4;
  end if;

  for night in
    select generate_series(
      new.stay_date,
      new.stay_date + (greatest(new.nights, 1) - 1),
      interval '1 day'
    )::date
  loop
    -- Serialize concurrent inserts touching the same night for this txn.
    perform pg_advisory_xact_lock(hashtext('booking_capacity'), hashtext(night::text));

    select count(*)
      into used
      from public.bookings
      where status in ('pending', 'approved')
        and id is distinct from new.id
        and stay_date <= night
        and stay_date + greatest(nights, 1) > night;

    if used >= max_groups then
      raise exception 'BOOKING_CAPACITY_FULL: % is fully booked', night;
    end if;
  end loop;

  return new;
end;
$$;

drop trigger if exists bookings_enforce_capacity on public.bookings;
create trigger bookings_enforce_capacity
  before insert on public.bookings
  for each row execute function public.enforce_booking_capacity();
