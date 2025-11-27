import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, FileText, Award } from "lucide-react";
import { Link } from "wouter";
import { APP_TITLE } from "@/const";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-10 w-10 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">{APP_TITLE}</h1>
                <p className="text-sm text-muted-foreground">Unidades Tecnológicas de Santander</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Sistema de Gestión y Seguimiento
            <span className="block text-primary mt-2">Exámenes Saber Pro</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Plataforma integral para la administración de resultados de las pruebas Saber Pro y
            gestión de incentivos académicos para estudiantes sobresalientes.
          </p>
        </div>
      </section>

      {/* Access Cards */}
      <section className="container pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Coordinación Card */}
            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Coordinación</CardTitle>
                    <CardDescription>Panel administrativo</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Acceso para coordinadores y personal administrativo. Gestiona estudiantes,
                  consulta resultados y genera informes detallados.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>Gestión de estudiantes (CRUD)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>Informes generales y detallados</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-primary" />
                    <span>Cálculo de beneficios e incentivos</span>
                  </div>
                </div>
                <Link href="/admin/dashboard">
                  <Button className="w-full" size="lg">
                    Acceder al Panel
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Estudiantes Card */}
            <Card className="border-2 hover:border-secondary transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-secondary/10 p-3">
                    <GraduationCap className="h-8 w-8 text-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Estudiantes</CardTitle>
                    <CardDescription>Portal de resultados</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Acceso para estudiantes. Consulta tus resultados del examen Saber Pro y conoce
                  los beneficios obtenidos según tu desempeño.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-secondary" />
                    <span>Resultados globales y por competencia</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-secondary" />
                    <span>Información de beneficios obtenidos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="h-4 w-4 text-secondary" />
                    <span>Nivel de inglés CEFR</span>
                  </div>
                </div>
                <Link href="/student/login">
                  <Button className="w-full bg-secondary hover:bg-secondary/90" size="lg">
                    Consultar Resultados
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm">
        <div className="container py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 Unidades Tecnológicas de Santander (UTS)</p>
            <p className="mt-1">Sistema de Gestión Saber Pro</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
