-- Create admin_groups table
create table if not exists public.admin_groups (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  status text not null check (status in ('active', 'inactive')) default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create admin_group_members table
create table if not exists public.admin_group_members (
  id uuid default uuid_generate_v4() primary key,
  group_id uuid references public.admin_groups(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(group_id, user_id)
);

-- Create RLS policies for admin_groups
alter table public.admin_groups enable row level security;

create policy "Admin users can manage admin groups"
  on public.admin_groups
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Create RLS policies for admin_group_members
alter table public.admin_group_members enable row level security;

create policy "Admin users can manage group members"
  on public.admin_group_members
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Grant necessary permissions
grant all on public.admin_groups to authenticated;
grant all on public.admin_group_members to authenticated;