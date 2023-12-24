ALTER TABLE `profiles` RENAME COLUMN `user_id` TO `userId`;--> statement-breakpoint
ALTER TABLE `profiles` RENAME COLUMN `image_url` TO `imageUrl`;--> statement-breakpoint
ALTER TABLE `servers` RENAME COLUMN `image_url` TO `imageUrl`;--> statement-breakpoint
ALTER TABLE `servers` RENAME COLUMN `invite_code` TO `inviteCode`;--> statement-breakpoint
DROP INDEX IF EXISTS `profiles_user_id_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_userId_unique` ON `profiles` (`userId`);