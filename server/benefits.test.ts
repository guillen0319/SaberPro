import { describe, expect, it } from "vitest";
import { calculateBenefit, getBenefitMessage } from "./benefits";

describe("calculateBenefit", () => {
  it("debe retornar No Aprobado para puntajes menores a 80", () => {
    const benefit = calculateBenefit(75);
    expect(benefit).not.toBeNull();
    expect(benefit?.category).toBe("No Aprobado");
    expect(benefit?.scholarship).toBe(0);
    expect(benefit?.grade).toBe(0);
  });

  it("debe retornar Aprobado para puntajes entre 80 y 179", () => {
    const benefit = calculateBenefit(150);
    expect(benefit).not.toBeNull();
    expect(benefit?.category).toBe("Aprobado");
    expect(benefit?.scholarship).toBe(0);
    expect(benefit?.grade).toBe(0);
  });

  it("debe retornar Nivel 1 para puntajes entre 180 y 210", () => {
    const benefit = calculateBenefit(195);
    expect(benefit).not.toBeNull();
    expect(benefit?.category).toBe("Nivel 1 - Sobresaliente");
    expect(benefit?.scholarship).toBe(0);
    expect(benefit?.grade).toBe(4.5);
    expect(benefit?.exemption).toContain("Exoneración");
  });

  it("debe retornar Nivel 2 para puntajes entre 211 y 240", () => {
    const benefit = calculateBenefit(225);
    expect(benefit).not.toBeNull();
    expect(benefit?.category).toBe("Nivel 2 - Excelente");
    expect(benefit?.scholarship).toBe(50);
    expect(benefit?.grade).toBe(4.7);
    expect(benefit?.exemption).toContain("Exoneración");
  });

  it("debe retornar Nivel 3 para puntajes mayores a 241", () => {
    const benefit = calculateBenefit(250);
    expect(benefit).not.toBeNull();
    expect(benefit?.category).toBe("Nivel 3 - Excepcional");
    expect(benefit?.scholarship).toBe(100);
    expect(benefit?.grade).toBe(5.0);
    expect(benefit?.exemption).toContain("Exoneración");
  });

  it("debe manejar correctamente el límite inferior de Nivel 1 (180)", () => {
    const benefit = calculateBenefit(180);
    expect(benefit?.category).toBe("Nivel 1 - Sobresaliente");
    expect(benefit?.grade).toBe(4.5);
  });

  it("debe manejar correctamente el límite superior de Nivel 1 (210)", () => {
    const benefit = calculateBenefit(210);
    expect(benefit?.category).toBe("Nivel 1 - Sobresaliente");
    expect(benefit?.grade).toBe(4.5);
  });

  it("debe manejar correctamente el límite inferior de Nivel 2 (211)", () => {
    const benefit = calculateBenefit(211);
    expect(benefit?.category).toBe("Nivel 2 - Excelente");
    expect(benefit?.scholarship).toBe(50);
  });

  it("debe manejar correctamente el límite superior de Nivel 2 (240)", () => {
    const benefit = calculateBenefit(240);
    expect(benefit?.category).toBe("Nivel 2 - Excelente");
    expect(benefit?.scholarship).toBe(50);
  });

  it("debe manejar correctamente el límite de Nivel 3 (241)", () => {
    const benefit = calculateBenefit(241);
    expect(benefit?.category).not.toBe("Nivel 2 - Excelente");
  });

  it("debe manejar correctamente puntajes en el límite de aprobación (80)", () => {
    const benefit = calculateBenefit(80);
    expect(benefit?.category).toBe("Aprobado");
  });

  it("debe manejar correctamente puntajes justo debajo del límite de aprobación (79)", () => {
    const benefit = calculateBenefit(79);
    expect(benefit?.category).toBe("No Aprobado");
  });
});

describe("getBenefitMessage", () => {
  it("debe generar mensaje para estudiante no aprobado", () => {
    const benefit = calculateBenefit(75);
    const message = getBenefitMessage(benefit);
    expect(message).toContain("Puntaje insuficiente");
  });

  it("debe generar mensaje para estudiante aprobado sin beneficios", () => {
    const benefit = calculateBenefit(150);
    const message = getBenefitMessage(benefit);
    expect(message).toContain("aprobado");
  });

  it("debe generar mensaje con información de beca para Nivel 2", () => {
    const benefit = calculateBenefit(225);
    const message = getBenefitMessage(benefit);
    expect(message).toContain("50%");
    expect(message).toContain("4.7");
  });

  it("debe generar mensaje con información de beca para Nivel 3", () => {
    const benefit = calculateBenefit(250);
    const message = getBenefitMessage(benefit);
    expect(message).toContain("100%");
    expect(message).toContain("5");
  });

  it("debe manejar beneficio null", () => {
    const message = getBenefitMessage(null);
    expect(message).toBe("No se pudo calcular el beneficio.");
  });
});
