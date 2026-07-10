-- ============================================================================
-- 0005: Add ③ポニーのお手入れ体験 and ⑥星空を眺めながらのんびり過ごす時間
-- as paid, bookable experience options.
--
-- Both were previously displayed as free/included experiences with no entry
-- in experience_options (not selectable/priced in the booking flow). Per
-- customer direction, both are now paid — priced in line with the existing
-- per-group options (餌やり体験 1,000円, 馬の写真撮影 3,000円):
--   ・ポニーのお手入れ体験: closer hands-on guided care than 餌やり, 1,500円/組
--   ・星空を眺めながらのんびり過ごす時間: evening blanket/reclining-chair
--     setup rental, 1,000円/組
--
-- Run manually in the Supabase SQL Editor (same as 0001-0004).
-- ============================================================================

insert into public.experience_options (code, name_ja, description, price, unit, sort_order) values
  ('pony_care', 'ポニーのお手入れ体験', 'ブラッシングなどのお手入れを通じて、ポニーのお世話を体験できます。', 1500, 'per_group', 5),
  ('stargazing', '星空を眺めながらのんびり過ごす時間', 'ブランケットとリクライニングチェアをご用意し、静かな牧場で星空を眺める夜のひとときをお過ごしいただけます。', 1000, 'per_group', 6)
on conflict (code) do nothing;
