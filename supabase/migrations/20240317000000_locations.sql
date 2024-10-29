-- Create locations table
create table if not exists public.locations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  site_number text not null unique,
  address text,
  city text,
  state text,
  zip_code text,
  phone text,
  status text not null check (status in ('active', 'inactive')) default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create location_administrators table
create table if not exists public.location_administrators (
  id uuid default uuid_generate_v4() primary key,
  location_id uuid references public.locations(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(location_id, user_id)
);

-- Enable RLS
alter table public.locations enable row level security;
alter table public.location_administrators enable row level security;

-- Create RLS policies for locations
create policy "Admin users can manage locations"
  on public.locations
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Create RLS policies for location_administrators
create policy "Admin users can manage location administrators"
  on public.location_administrators
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Grant necessary permissions
grant all on public.locations to authenticated;
grant all on public.location_administrators to authenticated;