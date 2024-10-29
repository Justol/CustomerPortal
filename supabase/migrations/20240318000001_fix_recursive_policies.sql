-- First drop existing policies
drop policy if exists "Admins can manage all profiles" on public.profiles;
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

-- Create a function to check if a user is an admin
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 
    from profiles 
    where id = user_id 
    and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Create new policies using the function
create policy "Admins can view all profiles"
  on public.profiles
  for select
  using (
    public.is_admin(auth.uid()) or 
    auth.uid() = id
  );

create policy "Admins can insert profiles"
  on public.profiles
  for insert
  with check (public.is_admin(auth.uid()));

create policy "Admins can update profiles"
  on public.profiles
  for update
  using (public.is_admin(auth.uid()));

create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id and
    role = 'customer' -- Prevent users from elevating their own role
  );

-- Grant necessary permissions
grant execute on function public.is_admin to authenticated;
grant execute on function public.is_admin to service_role;

-- Enable RLS
alter table public.profiles force row level security;

-- Enable realtime
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for all tables;
commit;