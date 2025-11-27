import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Award, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AdminDashboard() {
  const { data: studentsData, isLoading } = trpc.students.list.useQuery();
  const { data: benefitsData } = trpc.reports.benefits.useQuery();

  const totalStudents = studentsData?.length || 0;
  const studentsWithResults = studentsData?.filter(s => s.examResult)?.length || 0;
  
  const averageScore = studentsData && studentsData.length > 0
    ? Math.round(
        studentsData
          .filter(s => s.examResult)
          .reduce((sum, s) => sum + (s.examResult?.globalScore || 0), 0) / studentsWithResults
      )
    : 0;

  const studentsWithBenefits = benefitsData?.filter(
    b => b.benefit && b.benefit.scholarship > 0
  )?.length || 0;

  const stats = [
    {
      title: "Total Estudiantes",
      value: totalStudents,
      description: "Registrados en el sistema",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Con Resultados",
      value: studentsWithResults,
      description: "Tienen examen registrado",
      icon: FileText,
      color: "text-green-600",
    },
    {
      title: "Puntaje Promedio",
      value: averageScore,
      description: "De todos los estudiantes",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Con Beneficios",
      value: studentsWithBenefits,
      description: "Obtuvieron becas",
      icon: Award,
      color: "text-yellow-600",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bienvenido</h2>
          <p className="text-muted-foreground">
            Panel de administración del sistema Saber Pro
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando estadísticas...</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Accede a las funcionalidades principales del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <a
                href="/admin/students"
                className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
              >
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">Gestionar Estudiantes</p>
                  <p className="text-sm text-muted-foreground">CRUD completo</p>
                </div>
              </a>
              <a
                href="/admin/reports"
                className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
              >
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">Ver Informes</p>
                  <p className="text-sm text-muted-foreground">Generales y detallados</p>
                </div>
              </a>
              <a
                href="/admin/benefits"
                className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
              >
                <Award className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">Beneficios</p>
                  <p className="text-sm text-muted-foreground">Incentivos y becas</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
