CREATE TABLE `coursestats_account` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `coursestats_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `coursestats_authenticator` (
	`credentialID` text NOT NULL,
	`userId` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`credentialPublicKey` text NOT NULL,
	`counter` integer NOT NULL,
	`credentialDeviceType` text NOT NULL,
	`credentialBackedUp` integer NOT NULL,
	`transports` text,
	PRIMARY KEY(`userId`, `credentialID`),
	FOREIGN KEY (`userId`) REFERENCES `coursestats_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `coursestats_book_vote` (
	`courseId` text NOT NULL,
	`userId` text NOT NULL,
	`vote` integer NOT NULL,
	PRIMARY KEY(`courseId`, `userId`),
	FOREIGN KEY (`courseId`) REFERENCES `coursestats_course`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `coursestats_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `coursestats_comment_vote` (
	`commentId` text NOT NULL,
	`userId` text NOT NULL,
	`vote` integer NOT NULL,
	PRIMARY KEY(`commentId`, `userId`),
	FOREIGN KEY (`commentId`) REFERENCES `coursestats_comment`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `coursestats_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `coursestats_comment` (
	`id` text PRIMARY KEY NOT NULL,
	`courseId` text NOT NULL,
	`userId` text NOT NULL,
	`content` text,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`courseId`) REFERENCES `coursestats_course`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `coursestats_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `coursestats_course` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `coursestats_rating` (
	`courseId` text NOT NULL,
	`userId` text NOT NULL,
	`rating` integer NOT NULL,
	PRIMARY KEY(`courseId`, `userId`),
	FOREIGN KEY (`courseId`) REFERENCES `coursestats_course`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `coursestats_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `coursestats_semester` (
	`id` text PRIMARY KEY NOT NULL,
	`courseId` text NOT NULL,
	`year` integer NOT NULL,
	`semester` text NOT NULL,
	`a` integer,
	`b` integer,
	`c` integer,
	`d` integer,
	`e` integer,
	`f` integer,
	`passed` integer,
	`failed` integer,
	FOREIGN KEY (`courseId`) REFERENCES `coursestats_course`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `coursestats_session` (
	`sessionToken` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `coursestats_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `coursestats_user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`emailVerified` integer,
	`image` text
);
--> statement-breakpoint
CREATE TABLE `coursestats_verificationToken` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `coursestats_authenticator_credentialID_unique` ON `coursestats_authenticator` (`credentialID`);--> statement-breakpoint
CREATE INDEX `code_idx` ON `coursestats_course` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `coursestats_user_email_unique` ON `coursestats_user` (`email`);