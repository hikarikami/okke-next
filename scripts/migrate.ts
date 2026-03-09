/**
 * Manual migration script for adding auth tables and userId columns.
 * Run once: npx tsx scripts/migrate.ts
 */
import { createClient } from '@libsql/client';
import { config } from 'dotenv';

config();

const client = createClient({
	url: process.env.DATABASE_URL!,
	authToken: process.env.DATABASE_AUTH_TOKEN
});

const statements = [
	// Auth tables
	`CREATE TABLE IF NOT EXISTS \`user\` (
		\`id\` text PRIMARY KEY NOT NULL,
		\`name\` text NOT NULL,
		\`email\` text NOT NULL,
		\`email_verified\` integer DEFAULT false NOT NULL,
		\`image\` text,
		\`created_at\` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
		\`updated_at\` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
	)`,
	`CREATE UNIQUE INDEX IF NOT EXISTS \`user_email_unique\` ON \`user\` (\`email\`)`,

	`CREATE TABLE IF NOT EXISTS \`session\` (
		\`id\` text PRIMARY KEY NOT NULL,
		\`expires_at\` integer NOT NULL,
		\`token\` text NOT NULL,
		\`created_at\` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
		\`updated_at\` integer NOT NULL,
		\`ip_address\` text,
		\`user_agent\` text,
		\`user_id\` text NOT NULL,
		FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE cascade
	)`,
	`CREATE UNIQUE INDEX IF NOT EXISTS \`session_token_unique\` ON \`session\` (\`token\`)`,
	`CREATE INDEX IF NOT EXISTS \`session_userId_idx\` ON \`session\` (\`user_id\`)`,

	`CREATE TABLE IF NOT EXISTS \`account\` (
		\`id\` text PRIMARY KEY NOT NULL,
		\`account_id\` text NOT NULL,
		\`provider_id\` text NOT NULL,
		\`user_id\` text NOT NULL,
		\`access_token\` text,
		\`refresh_token\` text,
		\`id_token\` text,
		\`access_token_expires_at\` integer,
		\`refresh_token_expires_at\` integer,
		\`scope\` text,
		\`password\` text,
		\`created_at\` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
		\`updated_at\` integer NOT NULL,
		FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE cascade
	)`,
	`CREATE INDEX IF NOT EXISTS \`account_userId_idx\` ON \`account\` (\`user_id\`)`,

	`CREATE TABLE IF NOT EXISTS \`verification\` (
		\`id\` text PRIMARY KEY NOT NULL,
		\`identifier\` text NOT NULL,
		\`value\` text NOT NULL,
		\`expires_at\` integer NOT NULL,
		\`created_at\` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
		\`updated_at\` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
	)`,
	`CREATE INDEX IF NOT EXISTS \`verification_identifier_idx\` ON \`verification\` (\`identifier\`)`,

	// Drop old business_settings and recreate with userId
	`DROP TABLE IF EXISTS \`business_settings\``,
	`CREATE TABLE \`business_settings\` (
		\`id\` text PRIMARY KEY NOT NULL,
		\`user_id\` text NOT NULL,
		\`name\` text DEFAULT '' NOT NULL,
		\`abn\` text DEFAULT '' NOT NULL,
		\`street_address_json\` text DEFAULT '{}' NOT NULL,
		\`postal_address_same_as_street\` integer DEFAULT true NOT NULL,
		\`postal_address_json\` text DEFAULT '{}' NOT NULL,
		\`phone\` text DEFAULT '' NOT NULL,
		\`website\` text DEFAULT '' NOT NULL,
		\`email\` text DEFAULT '' NOT NULL,
		\`logo_url\` text DEFAULT '' NOT NULL,
		\`invoice_theme\` text DEFAULT 'classic' NOT NULL,
		\`brand_colour\` text DEFAULT '#37a87d' NOT NULL,
		FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE cascade
	)`,
	`CREATE UNIQUE INDEX IF NOT EXISTS \`business_settings_user_id_unique\` ON \`business_settings\` (\`user_id\`)`,

	// Add userId to app tables (clearing existing data first)
	`DELETE FROM \`categories\``,
	`ALTER TABLE \`categories\` ADD \`user_id\` text NOT NULL REFERENCES \`user\`(\`id\`) ON DELETE cascade`,

	`DELETE FROM \`companies\``,
	`ALTER TABLE \`companies\` ADD \`user_id\` text NOT NULL REFERENCES \`user\`(\`id\`) ON DELETE cascade`,

	`DELETE FROM \`contacts\``,
	`ALTER TABLE \`contacts\` ADD \`user_id\` text NOT NULL REFERENCES \`user\`(\`id\`) ON DELETE cascade`,

	`DELETE FROM \`invoices\``,
	`ALTER TABLE \`invoices\` ADD \`user_id\` text NOT NULL REFERENCES \`user\`(\`id\`) ON DELETE cascade`,

	`DELETE FROM \`transactions\``,
	`ALTER TABLE \`transactions\` ADD \`user_id\` text NOT NULL REFERENCES \`user\`(\`id\`) ON DELETE cascade`
];

console.log(`Running ${statements.length} migration statements…`);
for (const [i, sql] of statements.entries()) {
	try {
		await client.execute(sql);
		console.log(`  [${i + 1}/${statements.length}] OK`);
	} catch (err: unknown) {
		const msg = err instanceof Error ? err.message : String(err);
		// Ignore "already exists" errors for idempotent statements
		if (msg.includes('already exists') || msg.includes('duplicate column')) {
			console.log(`  [${i + 1}/${statements.length}] Skipped (already applied)`);
		} else {
			console.error(`  [${i + 1}/${statements.length}] FAILED: ${msg}`);
			process.exit(1);
		}
	}
}
console.log('Migration complete.');
