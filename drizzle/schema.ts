import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabla de estudiantes que presentaron el examen Saber Pro
 */
export const students = mysqlTable("students", {
  id: int("id").autoincrement().primaryKey(),
  documentType: varchar("documentType", { length: 10 }).notNull(),
  documentNumber: varchar("documentNumber", { length: 50 }).notNull().unique(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  secondName: varchar("secondName", { length: 100 }),
  firstLastName: varchar("firstLastName", { length: 100 }).notNull(),
  secondLastName: varchar("secondLastName", { length: 100 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  password: varchar("password", { length: 255 }).notNull(), // Contraseña hasheada para login
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Student = typeof students.$inferSelect;
export type InsertStudent = typeof students.$inferInsert;

/**
 * Tabla de resultados de exámenes Saber Pro
 */
export const examResults = mysqlTable("examResults", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull().references(() => students.id, { onDelete: "cascade" }),
  registrationNumber: varchar("registrationNumber", { length: 50 }).notNull().unique(),
  
  // Puntaje global
  globalScore: int("globalScore").notNull(),
  globalLevel: varchar("globalLevel", { length: 20 }).notNull(),
  
  // Comunicación Escrita
  writtenCommunicationScore: int("writtenCommunicationScore"),
  writtenCommunicationLevel: varchar("writtenCommunicationLevel", { length: 20 }),
  
  // Razonamiento Cuantitativo
  quantitativeReasoningScore: int("quantitativeReasoningScore"),
  quantitativeReasoningLevel: varchar("quantitativeReasoningLevel", { length: 20 }),
  
  // Lectura Crítica
  criticalReadingScore: int("criticalReadingScore"),
  criticalReadingLevel: varchar("criticalReadingLevel", { length: 20 }),
  
  // Competencias Ciudadanas
  citizenshipCompetenciesScore: int("citizenshipCompetenciesScore"),
  citizenshipCompetenciesLevel: varchar("citizenshipCompetenciesLevel", { length: 20 }),
  
  // Inglés
  englishScore: int("englishScore"),
  englishLevel: varchar("englishLevel", { length: 20 }),
  englishCEFRLevel: varchar("englishCEFRLevel", { length: 10 }), // A0, A1, A2, B1, B2
  
  // Formulación de Proyectos de Ingeniería
  engineeringProjectsScore: int("engineeringProjectsScore"),
  engineeringProjectsLevel: varchar("engineeringProjectsLevel", { length: 20 }),
  
  // Pensamiento Científico - Matemáticas y Estadística
  scientificThinkingScore: int("scientificThinkingScore"),
  scientificThinkingLevel: varchar("scientificThinkingLevel", { length: 20 }),
  
  // Diseño de Software
  softwareDesignScore: int("softwareDesignScore"),
  softwareDesignLevel: varchar("softwareDesignLevel", { length: 20 }),
  
  examDate: timestamp("examDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ExamResult = typeof examResults.$inferSelect;
export type InsertExamResult = typeof examResults.$inferInsert;