import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

export default function AdminBenefits() {
  const { data: benefitsData, isLoading } = trpc.reports.benefits.useQuery();

  const studentsWithBenefits = benefitsData?.filter(
    (item) => item.benefit && item.benefit.scholarship > 0
  ) || [];

  const stats = {
    total: benefitsData?.length || 0,
    scholarship100: benefitsData?.filter(b => b.benefit?.scholarship === 100).length || 0,
    scholarship50: benefitsData?.filter(b => b.benefit?.scholarship === 50).length || 0,
    noScholarship: benefitsData?.filter(b => b.benefit?.scholarship === 0).length || 0,
  };

  const exportToCSV = () => {
    if (!benefitsData) return;

    const headers = [
      "Documento",
      "Nombre Completo",
      "Puntaje",
      "Categoría",
      "Exoneración",
      "Nota",
      "Beca (%)"
    ];

    const rows = benefitsData.map((item) => {
      const fullName = `${item.student.firstName} ${item.student.secondName || ""} ${item.student.firstLastName} ${item.student.secondLastName || ""}`.trim();
      return [
        item.student.documentNumber,
        fullName,
        item.examResult?.globalScore || "N/A",
        item.benefit?.category || "N/A",
        item.benefit?.exemption || "N/A",
        item.benefit?.grade || "N/A",
        item.benefit?.scholarship || 0,
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `informe_beneficios_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Informe de Beneficios</h2>
            <p className="text-muted-foreground">
              Estudiantes elegibles para incentivos y becas
            </p>
          </div>
          <Button onClick={exportToCSV} disabled={!benefitsData || benefitsData.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Beca 100%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.scholarship100}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Beca 50%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.scholarship50}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Sin Beca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.noScholarship}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Estudiantes con Beneficios</CardTitle>
            <CardDescription>
              {studentsWithBenefits.length} estudiantes obtuvieron becas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Cargando datos...</p>
              </div>
            ) : studentsWithBenefits.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Documento</TableHead>
                      <TableHead>Nombre Completo</TableHead>
                      <TableHead>Puntaje</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Nota</TableHead>
                      <TableHead>Beca</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentsWithBenefits.map((item) => {
                      const fullName = `${item.student.firstName} ${item.student.secondName || ""} ${item.student.firstLastName} ${item.student.secondLastName || ""}`.trim();
                      return (
                        <TableRow key={item.student.id}>
                          <TableCell className="font-medium">
                            {item.student.documentNumber}
                          </TableCell>
                          <TableCell>{fullName}</TableCell>
                          <TableCell>
                            <span className="font-bold">{item.examResult?.globalScore}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.benefit?.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold">{item.benefit?.grade}</span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                item.benefit?.scholarship === 100
                                  ? "bg-green-500"
                                  : "bg-blue-500"
                              }
                            >
                              {item.benefit?.scholarship}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No hay estudiantes con beneficios registrados
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {benefitsData && benefitsData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Todos los Estudiantes</CardTitle>
              <CardDescription>Resumen completo de beneficios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Documento</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Puntaje</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Exoneración</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {benefitsData.map((item) => {
                      const fullName = `${item.student.firstName} ${item.student.firstLastName}`;
                      return (
                        <TableRow key={item.student.id}>
                          <TableCell>{item.student.documentNumber}</TableCell>
                          <TableCell>{fullName}</TableCell>
                          <TableCell>{item.examResult?.globalScore || "N/A"}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.benefit?.category || "N/A"}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {item.benefit?.exemption || "Ninguna"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
