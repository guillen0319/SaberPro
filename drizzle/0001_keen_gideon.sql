CREATE TABLE `examResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`registrationNumber` varchar(50) NOT NULL,
	`globalScore` int NOT NULL,
	`globalLevel` varchar(20) NOT NULL,
	`writtenCommunicationScore` int,
	`writtenCommunicationLevel` varchar(20),
	`quantitativeReasoningScore` int,
	`quantitativeReasoningLevel` varchar(20),
	`criticalReadingScore` int,
	`criticalReadingLevel` varchar(20),
	`citizenshipCompetenciesScore` int,
	`citizenshipCompetenciesLevel` varchar(20),
	`englishScore` int,
	`englishLevel` varchar(20),
	`englishCEFRLevel` varchar(10),
	`engineeringProjectsScore` int,
	`engineeringProjectsLevel` varchar(20),
	`scientificThinkingScore` int,
	`scientificThinkingLevel` varchar(20),
	`softwareDesignScore` int,
	`softwareDesignLevel` varchar(20),
	`examDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `examResults_id` PRIMARY KEY(`id`),
	CONSTRAINT `examResults_registrationNumber_unique` UNIQUE(`registrationNumber`)
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentType` varchar(10) NOT NULL,
	`documentNumber` varchar(50) NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`secondName` varchar(100),
	`firstLastName` varchar(100) NOT NULL,
	`secondLastName` varchar(100),
	`email` varchar(320),
	`phone` varchar(50),
	`password` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `students_id` PRIMARY KEY(`id`),
	CONSTRAINT `students_documentNumber_unique` UNIQUE(`documentNumber`)
);
--> statement-breakpoint
ALTER TABLE `examResults` ADD CONSTRAINT `examResults_studentId_students_id_fk` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE cascade ON UPDATE no action;