-- Reset the database by dropping all tables
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Disable triggers temporarily
    SET session_replication_role = 'replica';
    
    -- Drop all tables
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
    
    -- Re-enable triggers
    SET session_replication_role = 'origin';
END $$;

-- Run migrations in order
\i migrations/20240320000000_initial_schema.sql
\i migrations/20240321000000_add_subscriptions.sql
\i migrations/20240323000000_add_scheduling_fields.sql 