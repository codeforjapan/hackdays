# Supabase deployment

## Create new application

Goto https://app.supabase.io/ and create new project.

Copy server `API URL` and `anon key`

## set the server URL

You need to set remote supabase URL with supabase CLI

```bash
supabase db remote set postgresql://postgres:YOUR_INSTANCE.YOUR_PASSWORD.supabase.co:5432/postgres
supabase db remote commit
```

## wipe a local database

```bash
supabase db reset
```

## create a local migration file after modifying tables

```bash
supabase db commit <migration name>
```

This command will carete migration sql under `supabase/migrations/`

## push local changes to the server

```bash
supabase db push
```
