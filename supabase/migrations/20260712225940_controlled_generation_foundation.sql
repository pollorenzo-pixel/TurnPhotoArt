create extension if not exists pgcrypto;

create table public.artwork_sets (
  id uuid primary key default gen_random_uuid(),
  access_token_hash text not null unique check (length(access_token_hash) = 64),
  reference_sha256 text not null check (length(reference_sha256) = 64),
  source_mime_type text not null check (source_mime_type in ('image/jpeg','image/png','image/webp')),
  source_width integer not null check (source_width > 0 and source_width <= 12000),
  source_height integer not null check (source_height > 0 and source_height <= 12000),
  successful_generation_count smallint not null default 0 check (successful_generation_count between 0 and 3),
  status text not null default 'active' check (status in ('active','complete','expired')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  last_activity_at timestamptz not null default now()
);

create table public.generations (
  id uuid primary key default gen_random_uuid(),
  artwork_set_id uuid not null references public.artwork_sets(id) on delete cascade,
  sequence_number smallint not null check (sequence_number between 1 and 3),
  style_id text not null check (style_id in ('bold-playful','playful-storybook')),
  personality_length smallint not null default 0 check (personality_length between 0 and 160),
  personality_hash text,
  prompt_version text not null,
  provider_model text not null check (provider_model = 'gpt-image-2'),
  configured_quality text not null check (configured_quality in ('medium','high')),
  configured_size text not null check (configured_size in ('1024x1024','1024x1536','1536x1024')),
  status text not null check (status in ('reserved','processing','succeeded','failed','blocked','unknown')),
  provider_request_id text,
  reservation_cost_units integer not null check (reservation_cost_units > 0),
  provider_usage_summary jsonb,
  safe_error_code text,
  idempotency_key_hash text not null check (length(idempotency_key_hash) = 64),
  session_hash text not null check (length(session_hash) = 64),
  ip_hash text not null check (length(ip_hash) = 64),
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (artwork_set_id, idempotency_key_hash)
);

create table public.daily_usage (
  usage_date date primary key,
  reserved_requests integer not null default 0,
  completed_requests integer not null default 0,
  failed_requests integer not null default 0,
  blocked_requests integer not null default 0,
  unknown_requests integer not null default 0,
  reserved_cost_units bigint not null default 0,
  settled_cost_units bigint not null default 0,
  updated_at timestamptz not null default now()
);

create index generations_set_status_idx on public.generations (artwork_set_id, status);
create index generations_created_status_idx on public.generations (created_at desc, status);
create index generations_ip_created_idx on public.generations (ip_hash, created_at desc);
create index generations_session_status_idx on public.generations (session_hash, status);
create index artwork_sets_expiry_idx on public.artwork_sets (expires_at) where status = 'active';

alter table public.artwork_sets enable row level security;
alter table public.generations enable row level security;
alter table public.daily_usage enable row level security;

revoke all on table public.artwork_sets, public.generations, public.daily_usage from public, anon, authenticated;
grant select, insert, update on table public.artwork_sets, public.generations, public.daily_usage to service_role;

create or replace function public.reserve_artwork_generation(
  p_access_token_hash text, p_idempotency_key_hash text, p_session_hash text, p_ip_hash text,
  p_style_id text, p_personality_length integer, p_personality_hash text, p_prompt_version text,
  p_provider_model text, p_quality text, p_size text, p_daily_request_limit integer,
  p_hourly_ip_limit integer, p_global_concurrency_limit integer, p_daily_cost_limit_units integer,
  p_reservation_units integer
) returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_set public.artwork_sets%rowtype;
  v_generation public.generations%rowtype;
  v_count integer;
  v_held bigint;
begin
  select * into v_set from public.artwork_sets where access_token_hash = p_access_token_hash for update;
  if not found then raise exception 'TPA_ARTWORK_SET_INVALID'; end if;
  select * into v_generation from public.generations where artwork_set_id = v_set.id and idempotency_key_hash = p_idempotency_key_hash;
  if found then return jsonb_build_object('kind','existing','generation',to_jsonb(v_generation),'artwork_set',to_jsonb(v_set)); end if;
  if v_set.status <> 'active' or v_set.expires_at <= now() then
    if v_set.successful_generation_count >= 3 then raise exception 'TPA_GENERATION_LIMIT_REACHED'; end if;
    raise exception 'TPA_ARTWORK_SET_INVALID';
  end if;
  if v_set.successful_generation_count >= 3 then raise exception 'TPA_GENERATION_LIMIT_REACHED'; end if;
  if exists(select 1 from public.generations where artwork_set_id=v_set.id and status in ('reserved','processing','unknown')) then raise exception 'TPA_SET_GENERATION_ACTIVE'; end if;
  if exists(select 1 from public.generations where session_hash=p_session_hash and status in ('reserved','processing','unknown')) then raise exception 'TPA_SESSION_GENERATION_ACTIVE'; end if;
  select count(*) into v_count from public.generations where status in ('reserved','processing');
  if v_count >= p_global_concurrency_limit then raise exception 'TPA_GLOBAL_CONCURRENCY_REACHED'; end if;
  select count(*) into v_count from public.generations where created_at >= date_trunc('day', now());
  if v_count >= p_daily_request_limit then raise exception 'TPA_DAILY_REQUEST_LIMIT'; end if;
  select count(*) into v_count from public.generations where ip_hash=p_ip_hash and created_at >= now()-interval '1 hour';
  if v_count >= p_hourly_ip_limit then raise exception 'TPA_HOURLY_IP_LIMIT'; end if;
  select coalesce(sum(reservation_cost_units),0) into v_held from public.generations where created_at >= date_trunc('day',now()) and status in ('reserved','processing','unknown','succeeded');
  if v_held + p_reservation_units > p_daily_cost_limit_units then raise exception 'TPA_DAILY_COST_LIMIT'; end if;
  insert into public.generations(artwork_set_id,sequence_number,style_id,personality_length,personality_hash,prompt_version,provider_model,configured_quality,configured_size,status,reservation_cost_units,idempotency_key_hash,session_hash,ip_hash)
  values(v_set.id,v_set.successful_generation_count+1,p_style_id,p_personality_length,p_personality_hash,p_prompt_version,p_provider_model,p_quality,p_size,'reserved',p_reservation_units,p_idempotency_key_hash,p_session_hash,p_ip_hash) returning * into v_generation;
  insert into public.daily_usage(usage_date,reserved_requests,reserved_cost_units) values(current_date,1,p_reservation_units)
  on conflict(usage_date) do update set reserved_requests=public.daily_usage.reserved_requests+1,reserved_cost_units=public.daily_usage.reserved_cost_units+p_reservation_units,updated_at=now();
  update public.artwork_sets set last_activity_at=now() where id=v_set.id returning * into v_set;
  return jsonb_build_object('kind','reserved','generation',to_jsonb(v_generation),'artwork_set',to_jsonb(v_set));
end; $$;

create or replace function public.settle_artwork_generation(p_generation_id uuid,p_status text,p_safe_error_code text default null,p_provider_request_id text default null,p_provider_usage_summary jsonb default null)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare v_generation public.generations%rowtype; v_set public.artwork_sets%rowtype;
begin
  if p_status not in ('succeeded','failed','blocked','unknown') then raise exception 'TPA_INVALID_SETTLEMENT'; end if;
  select * into v_generation from public.generations where id=p_generation_id for update;
  if not found then raise exception 'TPA_GENERATION_NOT_FOUND'; end if;
  select * into v_set from public.artwork_sets where id=v_generation.artwork_set_id for update;
  if v_generation.status='succeeded' then return jsonb_build_object('artwork_set',to_jsonb(v_set)); end if;
  if v_generation.status not in ('reserved','processing') then raise exception 'TPA_GENERATION_STATE_INVALID'; end if;
  update public.generations set status=p_status,safe_error_code=p_safe_error_code,provider_request_id=p_provider_request_id,provider_usage_summary=p_provider_usage_summary,completed_at=case when p_status='unknown' then null else now() end where id=p_generation_id returning * into v_generation;
  if p_status='succeeded' then update public.artwork_sets set successful_generation_count=successful_generation_count+1,status=case when successful_generation_count+1>=3 then 'complete' else 'active' end,last_activity_at=now() where id=v_generation.artwork_set_id returning * into v_set;
  else update public.artwork_sets set last_activity_at=now() where id=v_generation.artwork_set_id returning * into v_set; end if;
  insert into public.daily_usage(usage_date) values(current_date) on conflict do nothing;
  update public.daily_usage set completed_requests=completed_requests+(p_status='succeeded')::int,failed_requests=failed_requests+(p_status='failed')::int,blocked_requests=blocked_requests+(p_status='blocked')::int,unknown_requests=unknown_requests+(p_status='unknown')::int,settled_cost_units=settled_cost_units+case when p_status in ('succeeded','unknown') then v_generation.reservation_cost_units else 0 end,updated_at=now() where usage_date=current_date;
  return jsonb_build_object('artwork_set',to_jsonb(v_set));
end; $$;

revoke all on function public.reserve_artwork_generation(text,text,text,text,text,integer,text,text,text,text,text,integer,integer,integer,integer,integer) from public, anon, authenticated;
revoke all on function public.settle_artwork_generation(uuid,text,text,text,jsonb) from public, anon, authenticated;
grant execute on function public.reserve_artwork_generation(text,text,text,text,text,integer,text,text,text,text,text,integer,integer,integer,integer,integer) to service_role;
grant execute on function public.settle_artwork_generation(uuid,text,text,text,jsonb) to service_role;
