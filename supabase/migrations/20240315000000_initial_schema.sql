-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Drop existing trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Drop existing function if it exists
drop function if exists public.handle_new_user();

-- Drop existing policies if they exist
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

-- Create profiles table if it doesn't exist
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
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
  role text check (role in ('admin', 'customer')) default 'customer',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create function to handle user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
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
    new.raw_user_meta_data->>'firstName',
    new.raw_user_meta_data->>'lastName',
    new.raw_user_meta_data->>'companyName',
    new.raw_user_meta_data->>'streetAddress',
    new.raw_user_meta_data->>'apartment',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'state',
    new.raw_user_meta_data->>'zipCode',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'selectedPlan',
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  );
  return new;
end;
$$;

-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);