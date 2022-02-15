-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE TABLE IF NOT EXISTS public.projects
(
    id uuid NOT NULL,
    owner_user_id uuid,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    purpose text COLLATE pg_catalog."default",
    what_to_do text COLLATE pg_catalog."default",
    problems text COLLATE pg_catalog."default",
    targets text COLLATE pg_catalog."default",
    needed_help text COLLATE pg_catalog."default",
    project_url character varying COLLATE pg_catalog."default",
    how_to_join text COLLATE pg_catalog."default",
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT projects_pkey PRIMARY KEY (id),
    CONSTRAINT projects_owner_user_id_fkey FOREIGN KEY (owner_user_id)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.projects
    OWNER to postgres;

ALTER TABLE IF EXISTS public.projects
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.projects ALTER COLUMN id SET DEFAULT uuid_generate_v4();

GRANT ALL ON TABLE public.projects TO anon;

GRANT ALL ON TABLE public.projects TO authenticated;

GRANT ALL ON TABLE public.projects TO postgres;

GRANT ALL ON TABLE public.projects TO service_role;

COMMENT ON TABLE public.projects
    IS 'Project table';
CREATE POLICY "Enable access to all users"
    ON public.projects
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true);
CREATE POLICY "Enable insert for authenticated users only"
    ON public.projects
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK ((auth.role() = 'authenticated'::text));
CREATE POLICY "Project owners can delete their projects"
    ON public.projects
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING ((auth.uid() = owner_user_id));
CREATE POLICY "Project owners can update their projects"
    ON public.projects
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING ((auth.uid() = owner_user_id));

REVOKE ALL ON TABLE public.profiles FROM anon;
REVOKE ALL ON TABLE public.profiles FROM authenticated;
REVOKE ALL ON TABLE public.profiles FROM postgres;
REVOKE ALL ON TABLE public.profiles FROM service_role;
REVOKE ALL ON TABLE public.profiles FROM supabase_admin;
GRANT ALL ON TABLE public.profiles TO anon;

GRANT ALL ON TABLE public.profiles TO authenticated;

GRANT ALL ON TABLE public.profiles TO postgres;

GRANT ALL ON TABLE public.profiles TO service_role;

GRANT ALL ON TABLE public.profiles TO supabase_admin;
