CREATE TABLE `channels` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`profileId` text NOT NULL,
	`serverId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`profileId`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`serverId`) REFERENCES `servers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`memberOneId` text NOT NULL,
	`memberTwoId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`memberOneId`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`memberTwoId`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `directMessages` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`fileUrl` text,
	`memberId` text NOT NULL,
	`conversationId` text NOT NULL,
	`deleted` integer,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`memberId`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`conversationId`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` text PRIMARY KEY NOT NULL,
	`role` text NOT NULL,
	`profileId` text NOT NULL,
	`serverId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`profileId`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`serverId`) REFERENCES `servers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`fileUrl` text,
	`memberId` text NOT NULL,
	`channelId` text NOT NULL,
	`deleted` integer,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`memberId`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`channelId`) REFERENCES `channels`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`name` text NOT NULL,
	`imageUrl` text NOT NULL,
	`email` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `servers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`imageUrl` text NOT NULL,
	`inviteCode` text NOT NULL,
	`profileId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`profileId`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `channelsProfileIdx` ON `channels` (`profileId`);--> statement-breakpoint
CREATE INDEX `channelsServerIdx` ON `channels` (`serverId`);--> statement-breakpoint
CREATE INDEX `conversationMemberOneIdx` ON `conversations` (`memberOneId`);--> statement-breakpoint
CREATE INDEX `conversationMemberTwoIdx` ON `conversations` (`memberTwoId`);--> statement-breakpoint
CREATE UNIQUE INDEX `memberOneAndTwoUniq` ON `conversations` (`memberOneId`,`memberTwoId`);--> statement-breakpoint
CREATE INDEX `directMessagesMemberIdx` ON `directMessages` (`memberId`);--> statement-breakpoint
CREATE INDEX `directMessagesConversationIdx` ON `directMessages` (`conversationId`);--> statement-breakpoint
CREATE INDEX `membersProfileIdx` ON `members` (`profileId`);--> statement-breakpoint
CREATE INDEX `membersServerIdx` ON `members` (`serverId`);--> statement-breakpoint
CREATE INDEX `messagesMemberIdx` ON `messages` (`memberId`);--> statement-breakpoint
CREATE INDEX `messagesChannelIdx` ON `messages` (`memberId`);--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_userId_unique` ON `profiles` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `servers_inviteCode_unique` ON `servers` (`inviteCode`);--> statement-breakpoint
CREATE INDEX `serversProfileIdx` ON `servers` (`profileId`);