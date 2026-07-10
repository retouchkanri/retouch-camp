-- ============================================================================
-- 0004: Align experience option display names with the customer's official copy
--
-- The customer's approved site copy names the experiences:
--   ④馬の写真撮影 (was 記念写真撮影), ⑤バーベキュー (was BBQセット)
-- These name_ja values appear in the booking form and admin booking details,
-- so the DB seed names must match the site copy.
--
-- Run manually in the Supabase SQL Editor (same as 0001-0003).
-- ============================================================================

update public.experience_options set name_ja = '馬の写真撮影' where code = 'photo';
update public.experience_options set name_ja = 'バーベキュー' where code = 'bbq';
