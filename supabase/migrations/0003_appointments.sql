-- ============================================================================
-- Appointment bookings made from the public website.
--
-- Security shape is deliberately the opposite of `blogs`:
--   blogs        — anon READS (published only), anon never writes.
--   appointments — anon WRITES (submits a booking), anon never reads.
--
-- These rows are patient data: name, mobile, age and the reason for the visit.
-- No anon SELECT policy exists, so a booking can be submitted with the
-- publishable key but can never be read back with it.
-- ============================================================================

create table if not exists public.appointments (
  id                uuid primary key default gen_random_uuid(),

  -- Shown to the patient on the confirmation screen.
  reference         text not null unique,
  token             text,

  -- Patient
  patient_name      text not null,
  mobile            text not null check (mobile ~ '^[6-9][0-9]{9}$'),
  age               int check (age between 0 and 120),
  gender            text,
  blood_group       text,

  -- Booking
  department        text,
  doctor_slug       text,
  doctor_name       text,
  appointment_date  date not null,
  appointment_time  text not null,
  visit_category    text,
  chief_concern     text,
  insurance         boolean not null default false,
  fee               int,

  -- Desk workflow
  status            text not null default 'new'
                      check (status in ('new','confirmed','completed','cancelled','no_show')),
  desk_notes        text,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists appointments_date_idx
  on public.appointments (appointment_date desc, created_at desc);
create index if not exists appointments_status_idx on public.appointments (status);
create index if not exists appointments_created_idx on public.appointments (created_at desc);
create index if not exists appointments_mobile_idx  on public.appointments (mobile);

drop trigger if exists appointments_set_updated_at on public.appointments;
create trigger appointments_set_updated_at
  before update on public.appointments
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------- RLS
alter table public.appointments enable row level security;

-- The public booking form may create a row and nothing else.
-- WITH CHECK constrains what can be written; the absence of a SELECT policy
-- is what stops anyone reading patient details back out with the public key.
drop policy if exists appointments_public_insert on public.appointments;
create policy appointments_public_insert
  on public.appointments
  for insert
  to anon
  with check (
    status = 'new'
    and length(patient_name) between 3 and 120
    and appointment_date >= (now() at time zone 'Asia/Kolkata')::date - 1
  );

-- The logged-in front desk sees and manages everything.
drop policy if exists appointments_admin_all on public.appointments;
create policy appointments_admin_all
  on public.appointments
  for all
  to authenticated
  using (true)
  with check (true);
