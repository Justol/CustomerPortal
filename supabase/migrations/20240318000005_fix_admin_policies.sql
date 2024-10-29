-- Drop existing policies
drop policy if exists "Allow admins and service role to insert profiles" on public.profiles;
drop policy if exists "Allow admins and service role to update profiles" on public.profiles;

-- Create a function to check if the current role is admin or service_role
create or replace function public.is_admin_or_service()
returns boolean as $$
begin
  return (
    current_setting('role') = 'service_role' or
    exists (
      select 1 
      from public.profiles
      where id = auth.uid() 
      and role = 'admin'
    )
  );
end;
$$ language plpgsql security definer;

-- Create new policies
create policy "Allow admins and service role to manage profiles"
on public.profiles
using (
  public.is_admin_or_service() or
  auth.uid() = id
)
with check (
  public.is_admin_or_service() or
  (auth.uid() = id and role != 'admin')
);

-- Grant necessary permissions
grant usage on schema public to authenticated, service_role;
grant all on public.profiles to authenticated, service_role;
grant execute on function public.is_admin_or_service() to authenticated, service_role;

-- Ensure RLS is enabled
alter table public.profiles force row level security;