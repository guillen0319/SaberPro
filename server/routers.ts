import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Routers para gestión de estudiantes y resultados
  students: router({
    // Obtener todos los estudiantes con sus resultados
    list: protectedProcedure.query(async () => {
      const { getAllStudentsWithResults } = await import("./db");
      return await getAllStudentsWithResults();
    }),
    
    // Obtener un estudiante por ID con su resultado
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getStudentWithExamResult } = await import("./db");
        return await getStudentWithExamResult(input.id);
      }),
    
    // Crear un estudiante con su resultado de examen
    create: protectedProcedure
      .input(z.object({
        student: z.object({
          documentType: z.string(),
          documentNumber: z.string(),
          firstName: z.string(),
          secondName: z.string().optional(),
          firstLastName: z.string(),
          secondLastName: z.string().optional(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
          password: z.string(),
        }),
        examResult: z.object({
          registrationNumber: z.string(),
          globalScore: z.number(),
          globalLevel: z.string(),
          writtenCommunicationScore: z.number().optional(),
          writtenCommunicationLevel: z.string().optional(),
          quantitativeReasoningScore: z.number().optional(),
          quantitativeReasoningLevel: z.string().optional(),
          criticalReadingScore: z.number().optional(),
          criticalReadingLevel: z.string().optional(),
          citizenshipCompetenciesScore: z.number().optional(),
          citizenshipCompetenciesLevel: z.string().optional(),
          englishScore: z.number().optional(),
          englishLevel: z.string().optional(),
          englishCEFRLevel: z.string().optional(),
          engineeringProjectsScore: z.number().optional(),
          engineeringProjectsLevel: z.string().optional(),
          scientificThinkingScore: z.number().optional(),
          scientificThinkingLevel: z.string().optional(),
          softwareDesignScore: z.number().optional(),
          softwareDesignLevel: z.string().optional(),
        }).optional(),
      }))
      .mutation(async ({ input }) => {
        const { createStudent, createExamResult } = await import("./db");
        const bcrypt = await import("bcryptjs");
        
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(input.student.password, 10);
        
        // Crear estudiante
        const studentResult = await createStudent({
          ...input.student,
          password: hashedPassword,
        });
        
        const studentId = Number(studentResult[0].insertId);
        
        // Crear resultado de examen si se proporciona
        if (input.examResult) {
          await createExamResult({
            studentId,
            ...input.examResult,
          });
        }
        
        return { success: true, studentId };
      }),
    
    // Actualizar un estudiante
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          documentType: z.string().optional(),
          documentNumber: z.string().optional(),
          firstName: z.string().optional(),
          secondName: z.string().optional(),
          firstLastName: z.string().optional(),
          secondLastName: z.string().optional(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        const { updateStudent } = await import("./db");
        await updateStudent(input.id, input.data);
        return { success: true };
      }),
    
    // Eliminar un estudiante
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const { deleteStudent } = await import("./db");
        await deleteStudent(input.id);
        return { success: true };
      }),
  }),
  
  // Router para autenticación de estudiantes
  studentAuth: router({
    // Login de estudiante
    login: publicProcedure
      .input(z.object({
        documentNumber: z.string(),
        password: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { getStudentByDocumentNumber } = await import("./db");
        const bcrypt = await import("bcryptjs");
        
        const student = await getStudentByDocumentNumber(input.documentNumber);
        
        if (!student) {
          throw new Error("Estudiante no encontrado");
        }
        
        const isValid = await bcrypt.compare(input.password, student.password);
        
        if (!isValid) {
          throw new Error("Contraseña incorrecta");
        }
        
        // Retornar datos del estudiante sin la contraseña
        const { password, ...studentData } = student;
        return studentData;
      }),
    
    // Obtener resultado del estudiante autenticado
    getMyResult: publicProcedure
      .input(z.object({ studentId: z.number() }))
      .query(async ({ input }) => {
        const { getStudentWithExamResult } = await import("./db");
        const { calculateBenefit, getBenefitMessage } = await import("./benefits");
        
        const data = await getStudentWithExamResult(input.studentId);
        
        if (!data || !data.examResult) {
          return null;
        }
        
        const benefit = calculateBenefit(data.examResult.globalScore);
        
        return {
          student: data.student,
          examResult: data.examResult,
          benefit,
          benefitMessage: getBenefitMessage(benefit),
        };
      }),
  }),
  
  // Router para informes y reportes
  reports: router({
    // Informe general de todos los estudiantes
    general: protectedProcedure.query(async () => {
      const { getAllStudentsWithResults } = await import("./db");
      return await getAllStudentsWithResults();
    }),
    
    // Informe de beneficios
    benefits: protectedProcedure.query(async () => {
      const { getAllStudentsWithResults } = await import("./db");
      const { calculateBenefit } = await import("./benefits");
      
      const studentsWithResults = await getAllStudentsWithResults();
      
      return studentsWithResults.map(({ student, examResult }) => {
        if (!examResult) {
          return {
            student,
            examResult: null,
            benefit: null,
          };
        }
        
        const benefit = calculateBenefit(examResult.globalScore);
        
        return {
          student,
          examResult,
          benefit,
        };
      });
    }),
  }),
});

export type AppRouter = typeof appRouter;
