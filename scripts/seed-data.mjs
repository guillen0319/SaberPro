import { drizzle } from "drizzle-orm/mysql2";
import { students, examResults } from "../drizzle/schema.js";
import bcrypt from "bcryptjs";
import fs from "fs";

const db = drizzle(process.env.DATABASE_URL);

// Leer datos del JSON generado desde el Excel
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const studentsData = JSON.parse(fs.readFileSync(join(__dirname, 'students_data.json'), 'utf-8'));

async function seed() {
  console.log("🌱 Iniciando carga de datos desde Excel completo...");
  console.log(`📊 Total de estudiantes a cargar: ${studentsData.length}`);

  try {
    let successCount = 0;
    let errorCount = 0;

    for (const studentData of studentsData) {
      try {
        // Generar número de documento único si no existe
        const docNumber = studentData.documentNumber || `1000${String(successCount + 1).padStart(6, '0')}`;
        
        // Crear estudiante con contraseña = número de documento
        const hashedPassword = await bcrypt.hash(docNumber, 10);

        const studentResult = await db.insert(students).values({
          documentType: studentData.documentType,
          documentNumber: docNumber,
          firstName: studentData.firstName,
          firstLastName: studentData.firstLastName,
          secondLastName: studentData.secondLastName || null,
          secondName: studentData.secondName || null,
          email: studentData.email || `${docNumber}@uts.edu.co`,
          phone: studentData.phone || null,
          password: hashedPassword,
        });

        const studentId = Number(studentResult[0].insertId);

        // Crear resultado de examen
        await db.insert(examResults).values({
          studentId,
          registrationNumber: studentData.registrationNumber,
          globalScore: studentData.globalScore,
          globalLevel: studentData.globalLevel,
          writtenCommunicationScore: studentData.writtenCommunicationScore,
          writtenCommunicationLevel: studentData.writtenCommunicationLevel,
          quantitativeReasoningScore: studentData.quantitativeReasoningScore,
          quantitativeReasoningLevel: studentData.quantitativeReasoningLevel,
          criticalReadingScore: studentData.criticalReadingScore,
          criticalReadingLevel: studentData.criticalReadingLevel,
          citizenshipCompetenciesScore: studentData.citizenshipCompetenciesScore,
          citizenshipCompetenciesLevel: studentData.citizenshipCompetenciesLevel,
          englishScore: studentData.englishScore,
          englishLevel: studentData.englishLevel,
          englishCEFRLevel: studentData.englishCEFRLevel,
          engineeringProjectsScore: studentData.engineeringProjectsScore,
          engineeringProjectsLevel: studentData.engineeringProjectsLevel,
          scientificThinkingScore: studentData.scientificThinkingScore,
          scientificThinkingLevel: studentData.scientificThinkingLevel,
          softwareDesignScore: studentData.softwareDesignScore,
          softwareDesignLevel: studentData.softwareDesignLevel,
        });

        console.log(`✅ ${successCount + 1}. ${studentData.firstLastName} - Puntaje: ${studentData.globalScore}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error al cargar ${studentData.firstLastName}:`, error.message);
        errorCount++;
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("✨ Proceso de carga completado!");
    console.log("=".repeat(60));
    console.log(`📊 Estadísticas:`);
    console.log(`   ✅ Estudiantes cargados exitosamente: ${successCount}`);
    console.log(`   ❌ Errores: ${errorCount}`);
    console.log(`   📈 Puntaje promedio: ${Math.round(studentsData.reduce((sum, s) => sum + s.globalScore, 0) / studentsData.length)}`);
    console.log(`   🏆 Puntaje máximo: ${Math.max(...studentsData.map(s => s.globalScore))}`);
    console.log(`   📉 Puntaje mínimo: ${Math.min(...studentsData.map(s => s.globalScore))}`);
    
    // Calcular distribución de beneficios
    const withBenefits = studentsData.filter(s => s.globalScore >= 180).length;
    const withScholarship50 = studentsData.filter(s => s.globalScore >= 211 && s.globalScore <= 240).length;
    const withScholarship100 = studentsData.filter(s => s.globalScore >= 241).length;
    
    console.log(`\n🎓 Beneficios:`);
    console.log(`   🌟 Estudiantes con beneficios (≥180): ${withBenefits}`);
    console.log(`   💰 Beca 50% (211-240): ${withScholarship50}`);
    console.log(`   🏅 Beca 100% (≥241): ${withScholarship100}`);
    
    console.log("\n🔑 Credenciales de acceso:");
    console.log("   Usuario: número de documento del estudiante");
    console.log("   Contraseña: mismo número de documento");
    console.log("\n📝 Ejemplo:");
    console.log(`   Usuario: ${studentsData[0].documentNumber || "1000000001"}`);
    console.log(`   Contraseña: ${studentsData[0].documentNumber || "1000000001"}`);
    
  } catch (error) {
    console.error("❌ Error crítico al cargar datos:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
