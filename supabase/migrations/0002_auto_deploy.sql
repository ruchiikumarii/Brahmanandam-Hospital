-- ============================================================================
-- Automatic publishing for a statically built site (Case B).
--
-- Every 3 minutes, check whether anything changed that the live build does not
-- yet reflect:
--   * a post was created or edited since the last deploy, OR
--   * a scheduled post's publish_at has just passed
-- If so, fire a GitHub repository_dispatch so CI rebuilds and redeploys.
--
-- Note what this does NOT do: it never updates `status`. A scheduled post goes
-- live because the clock moved past publish_at and the next build picks it up.
-- ============================================================================

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Store the GitHub token in Vault, not in the function body:
--   select vault.create_secret('ghp_xxx', 'github_dispatch_token');
--   select vault.create_secret('owner/repo', 'github_repo');

create or replace function public.trigger_deploy_if_needed()
returns void
language plpgsql
security definer
set search_path = public, extensions, vault
as $$
declare
  v_last   timestamptz;
  v_reason text;
  v_token  text;
  v_repo   text;
begin
  select last_dispatched into v_last from public.deploy_state where id = 1 for update;

  -- Never build more than once every 3 minutes.
  if v_last > now() - interval '3 minutes' then
    return;
  end if;

  -- (a) a published/edited post changed since the last deploy
  if exists (
    select 1 from public.blogs
    where updated_at > v_last
      and status in ('published','scheduled','archived')
  ) then
    v_reason := 'post created or edited';
  end if;

  -- (b) a scheduled post became due since the last deploy
  if v_reason is null and exists (
    select 1 from public.blogs
    where status = 'scheduled'
      and publish_at > v_last
      and publish_at <= now()
  ) then
    v_reason := 'scheduled post became due';
  end if;

  if v_reason is null then
    return;
  end if;

  select decrypted_secret into v_token
    from vault.decrypted_secrets where name = 'github_dispatch_token';
  select decrypted_secret into v_repo
    from vault.decrypted_secrets where name = 'github_repo';

  if v_token is null or v_repo is null then
    raise notice 'deploy skipped: github_dispatch_token / github_repo not in Vault';
    return;
  end if;

  perform net.http_post(
    url     := 'https://api.github.com/repos/' || v_repo || '/dispatches',
    headers := jsonb_build_object(
                 'Authorization', 'Bearer ' || v_token,
                 'Accept',        'application/vnd.github+json',
                 'Content-Type',  'application/json',
                 'User-Agent',    'brahmanandam-cms'
               ),
    body    := jsonb_build_object(
                 'event_type',     'cms-publish',
                 'client_payload', jsonb_build_object('reason', v_reason)
               )
  );

  update public.deploy_state
     set last_dispatched = now(), last_reason = v_reason
   where id = 1;
end;
$$;

revoke all on function public.trigger_deploy_if_needed() from public, anon, authenticated;

select cron.unschedule('cms-deploy-watch')
where exists (select 1 from cron.job where jobname = 'cms-deploy-watch');

select cron.schedule(
  'cms-deploy-watch',
  '*/3 * * * *',
  $$select public.trigger_deploy_if_needed();$$
);
