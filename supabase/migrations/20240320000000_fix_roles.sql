-- Drop existing triggers first
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists update_profiles_updated_at on public.profiles;

-- Drop existing functions
drop function if exists public.handle_new_user();
drop function if exists update_updated_at();

-- Drop existing tables
drop table if exists public.profiles cascade;
drop table if exists public.mailboxes cascade;
drop table if exists public.mail cascade;
drop table if exists public.packages cascade;

-- Drop existing types if they exist
drop type if exists user_role cascade;
drop type if exists user_status cascade;

-- Create enums
create type user_role as enum ('admin', 'customer');
create type user_status as enum ('active', 'inactive', 'suspended');

-- Create profiles table
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    first_name text,
    last_name text,
    role user_role not null default 'customer'::user_role,
    status user_status not null default 'active'::user_status,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create RLS policies
create policy "Users can read own profile"
    on profiles for select
    using (auth.uid() = id);

create policy "Admins can read all profiles"
    on profiles for select
    using (
        exists (
            select 1
            from profiles
            where id = auth.uid() and role = 'admin'
        )
    );

create policy "Admins can update all profiles"
    on profiles for update
    using (
        exists (
            select 1
            from profiles
            where id = auth.uid() and role = 'admin'
        )
    );

create policy "Users can update own profile"
    on profiles for update
    using (auth.uid() = id)
    with check (
        auth.uid() = id and 
        (role = 'customer' or exists (
            select 1 from profiles 
            where id = auth.uid() and role = 'admin'
        ))
    );

-- Create updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create updated_at trigger
create trigger update_profiles_updated_at
    before update on profiles
    for each row
    execute function update_updated_at();

-- Create new user handler function
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (
        id,
        email,
        first_name,
        last_name,
        role,
        status
    )
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'firstName', ''),
        coalesce(new.raw_user_meta_data->>'lastName', ''),
        coalesce(
            (new.raw_user_meta_data->>'role')::user_role,
            'customer'::user_role
        ),
        'active'::user_status
    );
    return new;
end;
$$ language plpgsql security definer;

-- Create auth trigger
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- Grant necessary permissions
grant usage on schema public to authenticated, anon;
grant all on public.profiles to authenticated, anon;
grant execute on function public.handle_new_user to service_role;
grant execute on function update_updated_at to authenticated, anon;