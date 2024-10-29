-- Drop existing policies and functions
drop policy if exists "Allow admins to insert profiles" on public.profiles;
drop policy if exists "Allow admins to update any profile" on public.profiles;

-- Update the is_admin function to be more permissive for the service role
create or replace function public.is_admin(check_user_id uuid default null)
returns boolean as $$
begin
  -- If running as service role, allow the operation
  if current_setting('role') = 'service_role' then
    return true;
  end if;

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

-- Create more permissive policies for admin operations
create policy "Allow admins and service role to insert profiles"
on public.profiles for insert
with check (
  public.is_admin() or 
  current_setting('role') = 'service_role'
);

create policy "Allow admins and service role to update profiles"
on public.profiles for update
using (
  public.is_admin() or 
  current_setting('role') = 'service_role'
);

-- Grant additional permissions to the service role
grant usage on schema public to service_role;
grant all on public.profiles to service_role;
grant execute on function public.is_admin(uuid) to service_role;