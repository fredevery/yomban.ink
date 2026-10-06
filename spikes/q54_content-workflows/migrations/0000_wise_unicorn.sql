CREATE TABLE `history` (
	`id` text PRIMARY KEY NOT NULL,
	`record_id` text NOT NULL,
	`kind` text NOT NULL,
	`name` text NOT NULL,
	`revision` integer,
	`detail` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`record_id`) REFERENCES `records`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `history_record_idx` ON `history` (`record_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `records` (
	`id` text PRIMARY KEY NOT NULL,
	`state` text DEFAULT 'draft' NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`published_revision` integer DEFAULT 0 NOT NULL,
	`payload` text NOT NULL,
	`schedule_at` text,
	`visible` integer DEFAULT true NOT NULL,
	`deleted_at` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `records_state_idx` ON `records` (`state`);--> statement-breakpoint
CREATE INDEX `records_sort_idx` ON `records` (`sort_order`);--> statement-breakpoint
CREATE TABLE `revisions` (
	`id` text PRIMARY KEY NOT NULL,
	`record_id` text NOT NULL,
	`revision` integer NOT NULL,
	`payload` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`record_id`) REFERENCES `records`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `revisions_record_idx` ON `revisions` (`record_id`,`revision`);
