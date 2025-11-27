import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Award, TrendingUp, LogOut, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function StudentDashboard() {
  const [, setLocation] = useLocation();
  const [studentId, setStudentId] = useState<number | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("studentId");
    if (!id) {
      setLocation("/student/login");
    } else {
      setStudentId(parseInt(id));
    }
  }, [setLocation]);

  const { data, isLoading } = trpc.studentAuth.getMyResult.useQuery(
    { studentId: studentId! },
    { enabled: !!studentId }
  );

  const handleLogout = () => {
    localStorage.removeItem("studentId");
    toast.success("Sesión cerrada");
    setLocation("/");
  };

  if (isLoading || !studentId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.examResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No se encontraron resultados</CardTitle>
            <CardDescription>
              No hay resultados registrados para tu cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogout} variant="outline" className="w-full">
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { student, examResult, benefit } = data;
  const fullName = `${student.firstName} ${student.secondName || ""} ${student.firstLastName} ${student.secondLastName || ""}`.trim();

  const getLevelColor = (level: string) => {
    if (level.includes("4")) return "bg-green-500";
    if (level.includes("3")) return "bg-blue-500";
    if (level.includes("2")) return "bg-yellow-500";
    return "bg-gray-500";
  };

  const competencies = [
    { name: "Comunicación Escrita", score: examResult.writtenCommunicationScore, level: examResult.writtenCommunicationLevel },
    { name: "Razonamiento Cuantitativo", score: examResult.quantitativeReasoningScore, level: examResult.quantitativeReasoningLevel },
    { name: "Lectura Crítica", score: examResult.criticalReadingScore, level: examResult.criticalReadingLevel },
    { name: "Competencias Ciudadanas", score: examResult.citizenshipCompetenciesScore, level: examResult.citizenshipCompetenciesLevel },
    { name: "Inglés", score: examResult.englishScore, level: examResult.englishLevel },
    { name: "Formulación de Proyectos", score: examResult.engineeringProjectsScore, level: examResult.engineeringProjectsLevel },
    { name: "Pensamiento Científico", score: examResult.scientificThinkingScore, level: examResult.scientificThinkingLevel },
    { name: "Diseño de Software", score: examResult.softwareDesignScore, level: examResult.softwareDesignLevel },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-secondary" />
              <div>
                <h1 className="text-xl font-bold">Portal de Estudiantes</h1>
                <p className="text-sm text-muted-foreground">{fullName}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Puntaje Global */}
        <Card className="mb-8 border-2 border-secondary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl">Resultado Global</CardTitle>
                <CardDescription>Examen Saber Pro</CardDescription>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-secondary">{examResult.globalScore}</div>
                <Badge className={`mt-2 ${getLevelColor(examResult.globalLevel)}`}>
                  {examResult.globalLevel}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Beneficios */}
        {benefit && (
          <Card className="mb-8 border-2 border-primary bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Beneficios Obtenidos</CardTitle>
                  <CardDescription>{benefit.category}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">{benefit.description}</p>
              {benefit.exemption !== "Ninguna" && (
                <div className="space-y-2">
                  <div className="rounded-lg bg-white p-4">
                    <p className="font-semibold text-primary">Exoneración:</p>
                    <p>{benefit.exemption}</p>
                    {benefit.grade > 0 && (
                      <p className="mt-2">
                        <span className="font-semibold">Nota:</span> {benefit.grade}
                      </p>
                    )}
                  </div>
                  {benefit.scholarship > 0 && (
                    <div className="rounded-lg bg-white p-4">
                      <p className="font-semibold text-primary">Beca:</p>
                      <p className="text-2xl font-bold">{benefit.scholarship}%</p>
                      <p className="text-sm text-muted-foreground">en derechos de grado</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Resultados por Competencia */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Resultados por Competencia
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {competencies.map((comp, index) => (
              comp.score && (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-base">{comp.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold">{comp.score}</div>
                      <Badge className={getLevelColor(comp.level || "")}>
                        {comp.level}
                      </Badge>
                    </div>
                    {comp.name === "Inglés" && examResult.englishCEFRLevel && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-sm">
                          Nivel CEFR: {examResult.englishCEFRLevel}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
