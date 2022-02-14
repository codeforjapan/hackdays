# Supabase deployment

## Create new application

Goto [https://app.supabase.io/](https://app.supabase.io/) and create new project.

Copy a server's instance ID from the server URL. Also, you will need postgresql password for the following steps.

`https://[YOUR_INSTANCE].supabase.co/`

## Change role

Run `ALTER ROLE postgres SUPERUSER;` in the project's SQL editor

## set the server URL

You need to set remote supabase DB URL and password with supabase CLI. Run below command in your Terminal.

The password should be `percent-encoded`.

```bash
supabase db remote set 'postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR_INSTANCE].supabase.co:5432/postgres'
supabase db remote push
supabase db remote commit
```

## Revert role

Run `ALTER ROLE postgres NOSUPERUSER;` in the project's SQL editor

## set Auth settings

Third party authentication is not supported on the local environment.
You need to use an app.supabase.io for testing Auth functions.

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
