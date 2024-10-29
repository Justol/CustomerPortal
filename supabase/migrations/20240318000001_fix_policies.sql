-- Drop existing policies
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Admins can insert profiles" on public.profiles;
drop policy if exists "Admins can update profiles" on public.profiles;

-- Create admin check function
create or replace function is_admin()
returns boolean as $$
begin
  return exists (
    select 1 
    from auth.users u 
    inner join public.profiles p on u.id = p.id
    where u.id = auth.uid() 
    and p.role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Create new policies
create policy "Allow users to view their own profile"
on public.profiles for select
using (
  auth.uid() = id
);

create policy "Allow admins to view all profiles"
on public.profiles for select
using (
  is_admin()
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
  is_admin()
);

create policy "Allow admins to insert profiles"
on public.profiles for insert
with check (
  is_admin()
);

-- Create trigger to ensure user role consistency
create or replace function check_user_role()
returns trigger as $$
begin
  if NEW.role = 'admin' and not is_admin() then
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
grant execute on function is_admin to authenticated;

-- Enable RLS
alter table public.profiles enable row level security;