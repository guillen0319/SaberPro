import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function StudentLogin() {
  const [, setLocation] = useLocation();
  const [documentNumber, setDocumentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = trpc.studentAuth.login.useMutation({
    onSuccess: (student) => {
      toast.success("Inicio de sesión exitoso");
      // Guardar el ID del estudiante en localStorage
      localStorage.setItem("studentId", student.id.toString());
      setLocation("/student/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Error al iniciar sesión");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await loginMutation.mutateAsync({
        documentNumber,
        password,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Button>
        </Link>

        <Card className="border-2">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-secondary/10 p-4">
                <GraduationCap className="h-12 w-12 text-secondary" />
              </div>
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl">Portal de Estudiantes</CardTitle>
              <CardDescription>Ingresa tus credenciales para consultar tus resultados</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="documentNumber">Número de Documento</Label>
                <Input
                  id="documentNumber"
                  type="text"
                  placeholder="Ingresa tu número de documento"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary/90"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>¿Primera vez ingresando?</p>
              <p className="mt-1">Tu contraseña inicial es tu número de documento</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
