-- Storage policies for Wander Bike buckets.
-- Assumes buckets `signatures` and `bike-photos` already exist.

create policy "signatures_authenticated_no_direct_read"
on storage.objects for select
using (
  bucket_id = 'signatures'
  and false
);

create policy "signatures_authenticated_no_direct_insert"
on storage.objects for insert
with check (
  bucket_id = 'signatures'
  and false
);

create policy "signatures_authenticated_no_direct_update"
on storage.objects for update
using (
  bucket_id = 'signatures'
  and false
)
with check (
  bucket_id = 'signatures'
  and false
);

create policy "signatures_authenticated_no_direct_delete"
on storage.objects for delete
using (
  bucket_id = 'signatures'
  and false
);

create policy "bike_photos_staff_owner_select"
on storage.objects for select
using (
  bucket_id = 'bike-photos'
  and public.is_staff_or_owner()
);

create policy "bike_photos_staff_owner_insert"
on storage.objects for insert
with check (
  bucket_id = 'bike-photos'
  and public.is_staff_or_owner()
);

create policy "bike_photos_staff_owner_update"
on storage.objects for update
using (
  bucket_id = 'bike-photos'
  and public.is_staff_or_owner()
)
with check (
  bucket_id = 'bike-photos'
  and public.is_staff_or_owner()
);

create policy "bike_photos_owner_delete"
on storage.objects for delete
using (
  bucket_id = 'bike-photos'
  and public.is_owner()
);
