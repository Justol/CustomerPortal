-- Update policies for profiles table
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

-- Allow admin users to manage all profiles
create policy "Admins can manage all profiles"
  on public.profiles
  using (
    auth.uid() in (
      select id from public.profiles 
      where role = 'admin'
    )
  )
  with check (
    auth.uid() in (
      select id from public.profiles 
      where role = 'admin'
    )
  );

-- Allow users to view and update their own profiles
create policy "Users can view their own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- Grant necessary permissions to the auth functions
grant usage on schema auth to service_role;
grant all on all tables in schema auth to service_role;

-- Enable realtime for profiles
alter publication supabase_realtime add table profiles;