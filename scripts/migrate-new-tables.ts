import postgres from "postgres";

const connectionString =
    process.env.DATABASE_URL ??
    "postgres://postgres:postgres@localhost:5432/postgres";

const sql = postgres(connectionString);

async function migrate() {
    console.log("Running migration for new tables...\n");

    try {
        // Create registration_status enum
        console.log("1. Creating registration_status enum...");
        await sql`
      DO $$ BEGIN
        CREATE TYPE "public"."registration_status" AS ENUM('pending', 'confirmed', 'cancelled');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
        console.log("   ✓ registration_status enum ready\n");

        // Create event_registrations table
        console.log("2. Creating event_registrations table...");
        await sql`
      CREATE TABLE IF NOT EXISTS "event_registrations" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" integer NOT NULL,
        "event_id" integer NOT NULL,
        "status" "registration_status" DEFAULT 'confirmed' NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;
        console.log("   ✓ event_registrations table created\n");

        // Create password_reset_tokens table
        console.log("3. Creating password_reset_tokens table...");
        await sql`
      CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" integer NOT NULL,
        "token_hash" text NOT NULL,
        "expires_at" timestamp with time zone NOT NULL,
        "used_at" timestamp with time zone,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;
        console.log("   ✓ password_reset_tokens table created\n");

        // Add foreign keys for event_registrations
        console.log("4. Adding foreign key constraints...");
        await sql`
      DO $$ BEGIN
        ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_user_id_users_id_fk" 
          FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
        await sql`
      DO $$ BEGIN
        ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_events_id_fk" 
          FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
        await sql`
      DO $$ BEGIN
        ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" 
          FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
        console.log("   ✓ Foreign keys added\n");

        // Create indexes
        console.log("5. Creating indexes...");
        await sql`CREATE UNIQUE INDEX IF NOT EXISTS "event_registrations_user_event_unique" ON "event_registrations" USING btree ("user_id","event_id");`;
        await sql`CREATE INDEX IF NOT EXISTS "event_registrations_user_idx" ON "event_registrations" USING btree ("user_id");`;
        await sql`CREATE INDEX IF NOT EXISTS "event_registrations_event_idx" ON "event_registrations" USING btree ("event_id");`;
        await sql`CREATE INDEX IF NOT EXISTS "event_registrations_status_idx" ON "event_registrations" USING btree ("status");`;
        await sql`CREATE UNIQUE INDEX IF NOT EXISTS "password_reset_tokens_token_hash_unique" ON "password_reset_tokens" USING btree ("token_hash");`;
        await sql`CREATE INDEX IF NOT EXISTS "password_reset_tokens_user_idx" ON "password_reset_tokens" USING btree ("user_id");`;
        console.log("   ✓ Indexes created\n");

        // Add parent_event_id column for sub-events
        console.log("6. Adding parent_event_id for sub-events...");
        await sql`
      DO $$ BEGIN
        ALTER TABLE "events" ADD COLUMN "parent_event_id" integer;
      EXCEPTION
        WHEN duplicate_column THEN null;
      END $$;
    `;
        await sql`CREATE INDEX IF NOT EXISTS "events_parent_event_idx" ON "events" USING btree ("parent_event_id");`;
        console.log("   ✓ parent_event_id column added\n");

        // Add registration_type enum and new columns for enhanced registration
        console.log("7. Adding enhanced registration fields...");
        await sql`
          DO $$ BEGIN
            CREATE TYPE "public"."registration_type" AS ENUM('individual', 'team');
          EXCEPTION
            WHEN duplicate_object THEN null;
          END $$;
        `;
        await sql`
          DO $$ BEGIN
            ALTER TABLE "event_registrations" ADD COLUMN "registration_type" "registration_type" NOT NULL DEFAULT 'individual';
          EXCEPTION
            WHEN duplicate_column THEN null;
          END $$;
        `;
        await sql`
          DO $$ BEGIN
            ALTER TABLE "event_registrations" ADD COLUMN "team_name" text;
          EXCEPTION
            WHEN duplicate_column THEN null;
          END $$;
        `;
        await sql`
          DO $$ BEGIN
            ALTER TABLE "event_registrations" ADD COLUMN "participant_name" text NOT NULL DEFAULT '';
          EXCEPTION
            WHEN duplicate_column THEN null;
          END $$;
        `;
        await sql`
          DO $$ BEGIN
            ALTER TABLE "event_registrations" ADD COLUMN "participant_email" text NOT NULL DEFAULT '';
          EXCEPTION
            WHEN duplicate_column THEN null;
          END $$;
        `;
        await sql`
          DO $$ BEGIN
            ALTER TABLE "event_registrations" ADD COLUMN "participant_phone" text;
          EXCEPTION
            WHEN duplicate_column THEN null;
          END $$;
        `;
        await sql`
          DO $$ BEGIN
            ALTER TABLE "event_registrations" ADD COLUMN "notes" text;
          EXCEPTION
            WHEN duplicate_column THEN null;
          END $$;
        `;
        await sql`
          DO $$ BEGIN
            ALTER TABLE "event_registrations" ADD COLUMN "team_members" text;
          EXCEPTION
            WHEN duplicate_column THEN null;
          END $$;
        `;
        await sql`CREATE INDEX IF NOT EXISTS "event_registrations_type_idx" ON "event_registrations" USING btree ("registration_type");`;
        console.log("   ✓ Enhanced registration fields added\n");

        // Add has_registration column for announcement-only events
        console.log("8. Adding has_registration column...");
        await sql`
          DO $$ BEGIN
            ALTER TABLE "events" ADD COLUMN "has_registration" boolean NOT NULL DEFAULT true;
          EXCEPTION
            WHEN duplicate_column THEN null;
          END $$;
        `;
        console.log("   ✓ has_registration column added\n");

        // Add documents column for event resources
        console.log("9. Adding documents column...");
        await sql`
          DO $$ BEGIN
            ALTER TABLE "events" ADD COLUMN "documents" json;
          EXCEPTION
            WHEN duplicate_column THEN null;
          END $$;
        `;

        // Ensure type is json (fix for previous run)
        await sql`ALTER TABLE "events" ALTER COLUMN "documents" TYPE json USING "documents"::json;`;

        console.log("   ✓ documents column added\n");

        // Add proposal submission columns
        console.log("10. Adding proposal submission columns...");
        await sql`
          DO $$ BEGIN
            ALTER TABLE "events" ADD COLUMN "enable_proposal_submission" boolean NOT NULL DEFAULT false;
          EXCEPTION
            WHEN duplicate_column THEN null;
          END $$;
        `;
        await sql`
          DO $$ BEGIN
            ALTER TABLE "event_registrations" ADD COLUMN "proposal_link" text;
          EXCEPTION
            WHEN duplicate_column THEN null;
          END $$;
        `;
        console.log("   ✓ proposal submission columns added\n");

        console.log("✅ Migration completed successfully!");
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

migrate();
