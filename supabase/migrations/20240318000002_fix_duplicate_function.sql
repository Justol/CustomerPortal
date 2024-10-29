-- First drop all policies that depend on is_admin
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Admins can insert profiles" on public.profiles;
drop policy if exists "Admins can update profiles" on public.profiles;
drop policy if exists "Allow users to view their own profile" on public.profiles;
drop policy if exists "Allow admins to view all profiles" on public.profiles;
drop policy if exists "Allow users to update their own non-admin profile" on public.profiles;
drop policy if exists "Allow admins to update any profile" on public.profiles;
drop policy if exists "Allow admins to insert profiles" on public.profiles;

-- Drop trigger and function
drop trigger if exists enforce_user_role on public.profiles;
drop function if exists check_user_role;

-- Now we can safely drop the is_admin functions
drop function if exists public.is_admin() cascade;
drop function if exists public.is_admin(uuid) cascade;

-- Create a single is_admin function with optional user_id parameter
create or replace function public.is_admin(check_user_id uuid default null)
returns boolean as $$
begin
  -- If no user_id provided, check current user
  if check_user_id is null then
    check_user_id := auth.uid();
  end if;
  
  return exists (
    select 1 
    from public.profiles
    where id = check_user_id 
    and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Create new policies using the updated function
create policy "Allow users to view their own profile"
on public.profiles for select
using (
  auth.uid() = id
);

create policy "Allow admins to view all profiles"
on public.profiles for select
using (
  public.is_admin()
);

create policy "Allow users to update their own non-admin profile"
on public.profiles for update
using (
  auth.uid() = id 
  and role != 'admin'
);

create policy "Allow admins to update any profile"
on public.profiles for update
using (
  public.is_admin()
);

create policy "Allow admins to insert profiles"
on public.profiles for insert
with check (
  public.is_admin()
);

-- Create trigger to ensure user role consistency
create or replace function check_user_role()
returns trigger as $$
begin
  if NEW.role = 'admin' and not public.is_admin() then
    raise exception 'Only admins can create or modify admin roles';
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger enforce_user_role
before insert or update on public.profiles
for each row
execute function check_user_role();

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant all on public.profiles to authenticated;
grant execute on function public.is_admin(uuid) to authenticated;

-- Enable RLS
alter table public.profiles enable row level security;

-- Enable realtime
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for all tables;
commit;