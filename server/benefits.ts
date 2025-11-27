/**
 * Lógica de negocio para calcular beneficios e incentivos
 * según el Acuerdo No. 01-009 (22 de abril de 2024) del Consejo Directivo UTS
 */

export interface Benefit {
  category: string;
  description: string;
  exemption: string;
  grade: number;
  scholarship: number; // Porcentaje de beca (0, 50, 100)
}

/**
 * Calcula el beneficio que le corresponde a un estudiante según su puntaje en Saber PRO
 * @param globalScore Puntaje global del estudiante (0-300)
 * @returns Objeto con información del beneficio o null si no aplica
 */
export function calculateBenefit(globalScore: number): Benefit | null {
  // Estudiantes con menos de 80 puntos no pueden graduarse
  if (globalScore < 80) {
    return {
      category: "No Aprobado",
      description: "Puntaje insuficiente para graduarse. Se requiere un mínimo de 80 puntos.",
      exemption: "Ninguna",
      grade: 0,
      scholarship: 0
    };
  }
  
  // Sin beneficio especial (80-179 puntos)
  if (globalScore >= 80 && globalScore < 180) {
    return {
      category: "Aprobado",
      description: "Has aprobado el examen Saber Pro. Continúa con el proceso normal de graduación.",
      exemption: "Ninguna",
      grade: 0,
      scholarship: 0
    };
  }
  
  // Nivel 1: 180-210 puntos
  if (globalScore >= 180 && globalScore <= 210) {
    return {
      category: "Nivel 1 - Sobresaliente",
      description: "¡Felicitaciones! Has obtenido un puntaje sobresaliente.",
      exemption: "Exoneración del informe final de trabajo de grado, o de realizar Seminario de grado IV",
      grade: 4.5,
      scholarship: 0
    };
  }
  
  // Nivel 2: 211-240 puntos
  if (globalScore >= 211 && globalScore <= 240) {
    return {
      category: "Nivel 2 - Excelente",
      description: "¡Excelente trabajo! Has alcanzado un nivel superior de desempeño.",
      exemption: "Exoneración del informe final de trabajo de grado, o de realizar Seminario de grado IV",
      grade: 4.7,
      scholarship: 50
    };
  }
  
  // Nivel 3: >241 puntos
  if (globalScore > 241) {
    return {
      category: "Nivel 3 - Excepcional",
      description: "¡Extraordinario! Has alcanzado el nivel más alto de desempeño académico.",
      exemption: "Exoneración del informe final de trabajo de grado, o de realizar Seminario de grado IV",
      grade: 5.0,
      scholarship: 100
    };
  }
  
  return null;
}

/**
 * Genera un mensaje personalizado para el estudiante según su beneficio
 */
export function getBenefitMessage(benefit: Benefit | null): string {
  if (!benefit) {
    return "No se pudo calcular el beneficio.";
  }
  
  if (benefit.category === "No Aprobado") {
    return benefit.description;
  }
  
  if (benefit.category === "Aprobado") {
    return benefit.description;
  }
  
  let message = `${benefit.description}\n\n`;
  message += `**Beneficios obtenidos:**\n`;
  message += `- ${benefit.exemption} con nota de **${benefit.grade}**\n`;
  
  if (benefit.scholarship > 0) {
    message += `- Beca del **${benefit.scholarship}%** en los derechos de grado\n`;
  }
  
  return message;
}
