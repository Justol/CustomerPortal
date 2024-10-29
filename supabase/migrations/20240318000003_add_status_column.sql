-- Add status column to profiles if it doesn't exist
do $$ 
begin
  if not exists (select 1 
    from information_schema.columns 
    where table_schema = 'public' 
    and table_name = 'profiles' 
    and column_name = 'status') then
    
    alter table public.profiles 
    add column status text not null default 'active' 
    check (status in ('active', 'inactive', 'suspended'));
  end if;
end $$;