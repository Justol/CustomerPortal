-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "citext";

-- Drop existing triggers and functions
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop function if exists update_updated_at_column();

-- Drop existing tables in correct order (handle dependencies)
drop table if exists public.mail cascade;
drop table if exists public.mailboxes cascade;
drop table if exists public.packages cascade;
drop table if exists public.profiles cascade;

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email citext unique not null,
  first_name text,
  last_name text,
  company_name text,
  street_address text,
  apartment text,
  city text,
  state text,
  zip_code text,
  phone text,
  selected_plan text,
  role text not null check (role in ('admin', 'customer')) default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create mailboxes table
create table public.mailboxes (
  id uuid default uuid_generate_v4() primary key,
  number text unique not null,
  type text not null check (type in ('digital_30', 'digital_60', 'physical_standard', 'physical_business', 'physical_executive')),
  status text not null check (status in ('active', 'suspended', 'cancelled')) default 'active',
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create mail table
create table public.mail (
  id uuid default uuid_generate_v4() primary key,
  sender text not null,
  recipient text not null,
  status text not null check (status in ('received', 'scanned', 'forwarded', 'archived')) default 'received',
  mailbox_id uuid references public.mailboxes(id) on delete cascade not null,
  scanned_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create packages table
create table public.packages (
  id uuid default uuid_generate_v4() primary key,
  tracking_no text unique not null,
  carrier text not null,
  status text not null check (status in ('received', 'processing', 'forwarded', 'delivered')) default 'received',
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create updated_at triggers for all tables
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function update_updated_at_column();

create trigger update_mailboxes_updated_at
  before update on public.mailboxes
  for each row execute function update_updated_at_column();

create trigger update_mail_updated_at
  before update on public.mail
  for each row execute function update_updated_at_column();

create trigger update_packages_updated_at
  before update on public.packages
  for each row execute function update_updated_at_column();

-- Create function to handle user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  raw_meta json;
begin
  raw_meta := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  
  insert into public.profiles (
    id,
    email,
    first_name,
    last_name,
    company_name,
    street_address,
    apartment,
    city,
    state,
    zip_code,
    phone,
    selected_plan,
    role
  ) values (
    new.id,
    new.email,
    coalesce(raw_meta->>'firstName', ''),
    coalesce(raw_meta->>'lastName', ''),
    raw_meta->>'companyName',
    raw_meta->>'streetAddress',
    raw_meta->>'apartment',
    raw_meta->>'city',
    raw_meta->>'state',
    raw_meta->>'zipCode',
    raw_meta->>'phone',
    raw_meta->>'selectedPlan',
    coalesce(raw_meta->>'role', 'customer')
  );
  return new;
exception
  when others then
    raise notice 'Error in handle_new_user: %', SQLERRM;
    return new;
end;
$$;

-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.mailboxes enable row level security;
alter table public.mail enable row level security;
alter table public.packages enable row level security;

-- Create RLS policies for profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Create RLS policies for mailboxes
create policy "Users can view their own mailboxes"
  on public.mailboxes for select
  using (auth.uid() = user_id);

create policy "Users can create their own mailboxes"
  on public.mailboxes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own mailboxes"
  on public.mailboxes for update
  using (auth.uid() = user_id);

create policy "Admins can view all mailboxes"
  on public.mailboxes for select
  using (exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  ));

-- Create RLS policies for mail
create policy "Users can view their own mail"
  on public.mail for select
  using (
    exists (
      select 1 from public.mailboxes
      where mailboxes.id = mail.mailbox_id
      and mailboxes.user_id = auth.uid()
    )
  );

create policy "Admins can view all mail"
  on public.mail for select
  using (exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  ));

-- Create RLS policies for packages
create policy "Users can view their own packages"
  on public.packages for select
  using (auth.uid() = user_id);

create policy "Users can create their own packages"
  on public.packages for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own packages"
  on public.packages for update
  using (auth.uid() = user_id);

create policy "Admins can view all packages"
  on public.packages for select
  using (exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  ));

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on public.profiles to anon, authenticated;
grant all on public.mailboxes to anon, authenticated;
grant all on public.mail to anon, authenticated;
grant all on public.packages to anon, authenticated;