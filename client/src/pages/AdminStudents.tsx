import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Eye, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function AdminStudents() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const utils = trpc.useUtils();

  const { data: studentsData, isLoading } = trpc.students.list.useQuery();

  const deleteMutation = trpc.students.delete.useMutation({
    onSuccess: () => {
      toast.success("Estudiante eliminado correctamente");
      utils.students.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar estudiante");
    },
  });

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`¿Estás seguro de eliminar a ${name}?`)) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  const filteredStudents = studentsData?.filter((item) => {
    const fullName = `${item.student.firstName} ${item.student.firstLastName}`.toLowerCase();
    const docNumber = item.student.documentNumber.toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || docNumber.includes(search);
  });

  const getLevelColor = (level: string) => {
    if (level.includes("4")) return "bg-green-500";
    if (level.includes("3")) return "bg-blue-500";
    if (level.includes("2")) return "bg-yellow-500";
    return "bg-gray-500";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Gestión de Estudiantes</h2>
            <p className="text-muted-foreground">
              Administra los estudiantes y sus resultados
            </p>
          </div>
          <Button onClick={() => setLocation("/admin/students/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Estudiante
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Estudiantes</CardTitle>
            <CardDescription>
              {filteredStudents?.length || 0} estudiantes registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Cargando estudiantes...</p>
              </div>
            ) : filteredStudents && filteredStudents.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Documento</TableHead>
                      <TableHead>Nombre Completo</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Puntaje</TableHead>
                      <TableHead>Nivel</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((item) => {
                      const fullName = `${item.student.firstName} ${item.student.secondName || ""} ${item.student.firstLastName} ${item.student.secondLastName || ""}`.trim();
                      return (
                        <TableRow key={item.student.id}>
                          <TableCell className="font-medium">
                            {item.student.documentNumber}
                          </TableCell>
                          <TableCell>{fullName}</TableCell>
                          <TableCell>{item.student.email || "N/A"}</TableCell>
                          <TableCell>
                            {item.examResult ? (
                              <span className="font-bold">{item.examResult.globalScore}</span>
                            ) : (
                              <span className="text-muted-foreground">Sin resultado</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {item.examResult ? (
                              <Badge className={getLevelColor(item.examResult.globalLevel)}>
                                {item.examResult.globalLevel}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setLocation(`/admin/students/${item.student.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(item.student.id, fullName)}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No se encontraron estudiantes
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
