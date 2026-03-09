CREATE TABLE `business_settings` (
	`id` text PRIMARY KEY DEFAULT 'default' NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`abn` text DEFAULT '' NOT NULL,
	`street_address_json` text DEFAULT '{}' NOT NULL,
	`postal_address_same_as_street` integer DEFAULT true NOT NULL,
	`postal_address_json` text DEFAULT '{}' NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`website` text DEFAULT '' NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`logo_url` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`type` text NOT NULL,
	`color` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`company_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`number` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`issue_date` text NOT NULL,
	`due_date` text NOT NULL,
	`from_json` text DEFAULT '{}' NOT NULL,
	`bill_to_json` text DEFAULT '{}' NOT NULL,
	`line_items_json` text DEFAULT '[]' NOT NULL,
	`tax_enabled` integer DEFAULT false NOT NULL,
	`tax_rate` real DEFAULT 0 NOT NULL,
	`subtotal` real DEFAULT 0 NOT NULL,
	`tax_amount` real DEFAULT 0 NOT NULL,
	`total` real DEFAULT 0 NOT NULL,
	`notes` text,
	`payment_terms` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`description` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`category_id` text,
	`date` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
