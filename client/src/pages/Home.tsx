import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Calculator, Plus, Trash2, Syringe } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DoseRow {
  id: number;
  period: string;
  doseMg: string;
}

interface CalculatedResult {
  period: string;
  doseMg: number;
  volumeMl: number;
  volumeUi: number;
}

export default function Home() {
  // Estado para concentração do medicamento
  const [totalMg, setTotalMg] = useState<string>("90");
  const [totalMl, setTotalMl] = useState<string>("3.5");
  
  // Estado para protocolo de doses
  const [doseRows, setDoseRows] = useState<DoseRow[]>([
    { id: 1, period: "Mês 1", doseMg: "2.5" },
    { id: 2, period: "Mês 2", doseMg: "5" },
    { id: 3, period: "Mês 3", doseMg: "7.5" },
    { id: 4, period: "Mês 4", doseMg: "10" },
    { id: 5, period: "Mês 5", doseMg: "12.5" },
    { id: 6, period: "Mês 6", doseMg: "15" },
  ]);
  
  const [nextId, setNextId] = useState(7);
  const [results, setResults] = useState<CalculatedResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Função para adicionar nova linha
  const addDoseRow = () => {
    const newRow: DoseRow = {
      id: nextId,
      period: `Mês ${nextId}`,
      doseMg: "",
    };
    setDoseRows([...doseRows, newRow]);
    setNextId(nextId + 1);
  };

  // Função para remover linha
  const removeDoseRow = (id: number) => {
    if (doseRows.length > 1) {
      setDoseRows(doseRows.filter(row => row.id !== id));
    }
  };

  // Função para atualizar linha
  const updateDoseRow = (id: number, field: keyof DoseRow, value: string) => {
    setDoseRows(doseRows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  // Função para calcular doses
  const calculateDoses = () => {
    const mg = parseFloat(totalMg);
    const ml = parseFloat(totalMl);

    // Validação
    if (!mg || !ml || mg <= 0 || ml <= 0) {
      alert("Por favor, insira valores válidos para a concentração do medicamento.");
      return;
    }

    // Calcular concentração (mg/mL)
    const concentration = mg / ml;

    // Calcular resultados para cada dose
    const calculatedResults: CalculatedResult[] = [];
    
    for (const row of doseRows) {
      const dose = parseFloat(row.doseMg);
      
      if (!dose || dose <= 0) {
        continue; // Pular linhas vazias ou inválidas
      }

      // Volume em mL = Dose (mg) ÷ Concentração (mg/mL)
      const volumeMl = dose / concentration;
      
      // Volume em UI = Volume (mL) × 100
      const volumeUi = volumeMl * 100;

      calculatedResults.push({
        period: row.period,
        doseMg: dose,
        volumeMl: parseFloat(volumeMl.toFixed(3)), // 3 casas decimais
        volumeUi: Math.round(volumeUi), // Arredondar para inteiro
      });
    }

    if (calculatedResults.length === 0) {
      alert("Por favor, insira pelo menos uma dose válida.");
      return;
    }

    setResults(calculatedResults);
    setShowResults(true);
  };

  // Calcular concentração para exibição
  const concentration = totalMg && totalMl && parseFloat(totalMg) > 0 && parseFloat(totalMl) > 0
    ? (parseFloat(totalMg) / parseFloat(totalMl)).toFixed(2)
    : "0.00";

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header com título */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Syringe className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Calculadora de Doses de Insulina
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Automatize o cálculo da dose a ser aspirada em seringa de insulina
          </p>
        </div>

        {/* Disclaimer médico */}
        <Alert className="mb-8 bg-yellow-50 border-yellow-300">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <AlertDescription className="text-yellow-800 font-medium">
            <strong>⚠️ AVISO IMPORTANTE:</strong> Esta ferramenta é apenas um auxiliar de cálculo. 
            Não substitui orientação médica profissional. Sempre consulte um profissional de saúde 
            antes de administrar medicamentos.
          </AlertDescription>
        </Alert>

        {/* Card 1: Configuração do Medicamento */}
        <Card className="mb-6 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Concentração do Medicamento
            </CardTitle>
            <CardDescription>
              Insira a quantidade total e o volume total do medicamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="totalMg" className="text-base font-semibold">
                  Quantidade Total (mg)
                </Label>
                <Input
                  id="totalMg"
                  type="number"
                  step="0.1"
                  value={totalMg}
                  onChange={(e) => setTotalMg(e.target.value)}
                  className="text-lg"
                  placeholder="Ex: 90"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalMl" className="text-base font-semibold">
                  Volume Total (mL)
                </Label>
                <Input
                  id="totalMl"
                  type="number"
                  step="0.1"
                  value={totalMl}
                  onChange={(e) => setTotalMl(e.target.value)}
                  className="text-lg"
                  placeholder="Ex: 3.5"
                />
              </div>
            </div>
            
            {/* Exibir concentração calculada */}
            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Concentração calculada:</p>
              <p className="text-2xl font-bold text-primary">
                {concentration} mg/mL
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Protocolo de Doses */}
        <Card className="mb-6 shadow-md">
          <CardHeader>
            <CardTitle>Protocolo de Doses Semanais</CardTitle>
            <CardDescription>
              Configure as doses semanais para cada período do tratamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {doseRows.map((row) => (
                <div key={row.id} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Label htmlFor={`period-${row.id}`} className="text-sm">
                      Período
                    </Label>
                    <Input
                      id={`period-${row.id}`}
                      value={row.period}
                      onChange={(e) => updateDoseRow(row.id, "period", e.target.value)}
                      placeholder="Ex: Mês 1"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`dose-${row.id}`} className="text-sm">
                      Dose (mg)
                    </Label>
                    <Input
                      id={`dose-${row.id}`}
                      type="number"
                      step="0.1"
                      value={row.doseMg}
                      onChange={(e) => updateDoseRow(row.id, "doseMg", e.target.value)}
                      placeholder="Ex: 2.5"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeDoseRow(row.id)}
                    disabled={doseRows.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={addDoseRow}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Período
            </Button>

            <Button
              className="w-full mt-6 text-lg py-6"
              onClick={calculateDoses}
            >
              <Calculator className="w-5 h-5 mr-2" />
              Calcular Doses
            </Button>
          </CardContent>
        </Card>

        {/* Card 3: Resultados */}
        {showResults && results.length > 0 && (
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-2xl">Resultados do Cálculo</CardTitle>
              <CardDescription>
                Volumes a serem aspirados na seringa de insulina
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Período</TableHead>
                      <TableHead className="font-bold text-right">Dose (mg)</TableHead>
                      <TableHead className="font-bold text-right">Volume (mL)</TableHead>
                      <TableHead className="font-bold text-right">Volume (UI)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result, index) => (
                      <TableRow key={index} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{result.period}</TableCell>
                        <TableCell className="text-right">{result.doseMg.toFixed(1)}</TableCell>
                        <TableCell className="text-right">
                          <span className="font-bold text-primary text-lg">
                            {result.volumeMl.toFixed(3)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-bold text-emerald-600 text-lg">
                            {result.volumeUi}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Nota:</strong> Os valores em mL são arredondados para 3 casas decimais. 
                  Os valores em UI (Unidades de Insulina) são arredondados para o inteiro mais próximo, 
                  considerando que 1 mL = 100 UI em seringas padrão.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>© 2025 Calculadora de Doses de Insulina. Desenvolvido para auxiliar profissionais de saúde.</p>
        </div>
      </div>
    </div>
  );
}
