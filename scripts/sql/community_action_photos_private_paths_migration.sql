-- Allow new private photo records to store an object path without a public URL.
-- Existing rows and their image URLs are preserved.

begin;

alter table public.community_action_photos
  add column if not exists image_path text;

alter table public.community_action_photos
  alter column image_url drop not null;

commit;