-- Create extensions
create extension if not exists "uuid-ossp";

-- Create tables
create type user_role as enum ('admin', 'customer');
create type mailbox_type as enum ('digital_30', 'digital_60', 'physical_standard', 'physical_business', 'physical_executive');
create type mailbox_status as enum ('active', 'suspended', 'cancelled');
create type mail_status as enum ('received', 'scanned', 'forwarded', 'archived');
create type package_status as enum ('received', 'processing', 'forwarded', 'delivered');

-- Profiles table (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users on delete cascade,
  email text unique not null,
  first_name text,
  last_name text,
  role user_role default 'customer',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Mailboxes table
create table mailboxes (
  id uuid default uuid_generate_v4() primary key,
  number text unique not null,
  type mailbox_type not null,
  status mailbox_status default 'active',
  user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Mail table
create table mail (
  id uuid default uuid_generate_v4() primary key,
  sender text not null,
  recipient text not null,
  status mail_status default 'received',
  mailbox_id uuid references mailboxes(id) on delete cascade not null,
  scanned_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Packages table
create table packages (
  id uuid default uuid_generate_v4() primary key,
  tracking_no text unique not null,
  carrier text not null,
  status package_status default 'received',
  user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table mailboxes enable row level security;
alter table mail enable row level security;
alter table packages enable row level security;

-- Create policies
-- Profiles policies
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Mailboxes policies
create policy "Users can view own mailboxes"
  on mailboxes for select
  using (auth.uid() = user_id);

create policy "Users can update own mailboxes"
  on mailboxes for update
  using (auth.uid() = user_id);

-- Mail policies
create policy "Users can view mail in their mailboxes"
  on mail for select
  using (
    mailbox_id in (
      select id from mailboxes where user_id = auth.uid()
    )
  );

-- Packages policies
create policy "Users can view own packages"
  on packages for select
  using (auth.uid() = user_id);

create policy "Users can update own packages"
  on packages for update
  using (auth.uid() = user_id);

-- Admin policies
create policy "Admins can view all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update all profiles"
  on profiles for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can view all mailboxes"
  on mailboxes for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can view all mail"
  on mail for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can view all packages"
  on packages for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Create functions
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'firstName',
    new.raw_user_meta_data->>'lastName',
    (new.raw_user_meta_data->>'role')::user_role
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();