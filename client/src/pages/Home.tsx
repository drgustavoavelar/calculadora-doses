import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Calculator, Plus, Trash2, Syringe, RotateCcw, Printer } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

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

interface SavedData {
  totalMg: string;
  totalMl: string;
  doseRows: DoseRow[];
  nextId: number;
}

const STORAGE_KEY = "calculadora-insulina-data";

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

  // Carregar dados do LocalStorage ao iniciar
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed: SavedData = JSON.parse(savedData);
        setTotalMg(parsed.totalMg);
        setTotalMl(parsed.totalMl);
        setDoseRows(parsed.doseRows);
        setNextId(parsed.nextId);
        toast.success("Dados anteriores carregados com sucesso!");
      } catch (error) {
        console.error("Erro ao carregar dados salvos:", error);
      }
    }
  }, []);

  // Salvar dados no LocalStorage sempre que houver mudança
  useEffect(() => {
    const dataToSave: SavedData = {
      totalMg,
      totalMl,
      doseRows,
      nextId,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [totalMg, totalMl, doseRows, nextId]);

  // Função para resetar todos os dados
  const resetAllData = () => {
    const defaultRows: DoseRow[] = [
      { id: 1, period: "Mês 1", doseMg: "2.5" },
      { id: 2, period: "Mês 2", doseMg: "5" },
      { id: 3, period: "Mês 3", doseMg: "7.5" },
      { id: 4, period: "Mês 4", doseMg: "10" },
      { id: 5, period: "Mês 5", doseMg: "12.5" },
      { id: 6, period: "Mês 6", doseMg: "15" },
    ];
    
    setTotalMg("90");
    setTotalMl("3.5");
    setDoseRows(defaultRows);
    setNextId(7);
    setResults([]);
    setShowResults(false);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Dados resetados com sucesso!");
  };

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
    } else {
      toast.error("É necessário manter pelo menos uma linha de dose.");
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
      toast.error("Por favor, insira valores válidos para a concentração do medicamento.");
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
      toast.error("Por favor, insira pelo menos uma dose válida.");
      return;
    }

    setResults(calculatedResults);
    setShowResults(true);
    toast.success("Doses calculadas com sucesso!");
  };

  // Função para imprimir resultados
  const printResults = () => {
    if (results.length === 0) {
      toast.error("Calcule as doses antes de imprimir.");
      return;
    }
    window.print();
  };

  // Calcular concentração para exibição
  const concentration = totalMg && totalMl && parseFloat(totalMg) > 0 && parseFloat(totalMl) > 0
    ? (parseFloat(totalMg) / parseFloat(totalMl)).toFixed(2)
    : "0.00";

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header com título */}
        <div className="text-center mb-8 print:mb-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Syringe className="w-10 h-10 text-primary print:hidden" />
            <h1 className="text-4xl font-bold text-foreground print:text-2xl">
              Calculadora de Doses de Insulina
            </h1>
          </div>
          <p className="text-muted-foreground text-lg print:text-sm">
            Automatize o cálculo da dose a ser aspirada em seringa de insulina
          </p>
        </div>

        {/* Disclaimer médico */}
        <Alert className="mb-8 bg-yellow-50 border-yellow-300 print:mb-4">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <AlertDescription className="text-yellow-800 font-medium print:text-xs">
            <strong>⚠️ AVISO IMPORTANTE:</strong> Esta ferramenta é apenas um auxiliar de cálculo. 
            Não substitui orientação médica profissional. Sempre consulte um profissional de saúde 
            antes de administrar medicamentos.
          </AlertDescription>
        </Alert>

        {/* Botões de ação no topo */}
        <div className="flex gap-3 mb-6 print:hidden">
          <Button
            variant="outline"
            onClick={resetAllData}
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Limpar Tudo
          </Button>
          <Button
            variant="outline"
            onClick={printResults}
            className="flex-1"
            disabled={!showResults}
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimir Resultados
          </Button>
        </div>

        {/* Card 1: Configuração do Medicamento */}
        <Card className="mb-6 shadow-md print:shadow-none print:mb-3">
          <CardHeader className="print:py-2">
            <CardTitle className="flex items-center gap-2 print:text-base">
              <Calculator className="w-5 h-5 print:hidden" />
              Concentração do Medicamento
            </CardTitle>
            <CardDescription className="print:text-xs">
              Insira a quantidade total e o volume total do medicamento
            </CardDescription>
          </CardHeader>
          <CardContent className="print:py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-3">
              <div className="space-y-2">
                <Label htmlFor="totalMg" className="text-base font-semibold print:text-sm">
                  Quantidade Total (mg)
                </Label>
                <Input
                  id="totalMg"
                  type="number"
                  step="0.1"
                  value={totalMg}
                  onChange={(e) => setTotalMg(e.target.value)}
                  className="text-lg print:text-sm"
                  placeholder="Ex: 90"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalMl" className="text-base font-semibold print:text-sm">
                  Volume Total (mL)
                </Label>
                <Input
                  id="totalMl"
                  type="number"
                  step="0.1"
                  value={totalMl}
                  onChange={(e) => setTotalMl(e.target.value)}
                  className="text-lg print:text-sm"
                  placeholder="Ex: 3.5"
                />
              </div>
            </div>
            
            {/* Exibir concentração calculada */}
            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20 print:mt-2 print:p-2">
              <p className="text-sm text-muted-foreground mb-1 print:text-xs">Concentração calculada:</p>
              <p className="text-2xl font-bold text-primary print:text-lg">
                {concentration} mg/mL
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Protocolo de Doses */}
        <Card className="mb-6 shadow-md print:shadow-none print:mb-3">
          <CardHeader className="print:py-2">
            <CardTitle className="print:text-base">Protocolo de Doses Semanais</CardTitle>
            <CardDescription className="print:text-xs">
              Configure as doses semanais para cada período do tratamento
            </CardDescription>
          </CardHeader>
          <CardContent className="print:py-2">
            <div className="space-y-3 print:space-y-1">
              {doseRows.map((row) => (
                <div key={row.id} className="flex gap-3 items-end print:gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`period-${row.id}`} className="text-sm print:text-xs">
                      Período
                    </Label>
                    <Input
                      id={`period-${row.id}`}
                      value={row.period}
                      onChange={(e) => updateDoseRow(row.id, "period", e.target.value)}
                      placeholder="Ex: Mês 1"
                      className="print:text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`dose-${row.id}`} className="text-sm print:text-xs">
                      Dose (mg)
                    </Label>
                    <Input
                      id={`dose-${row.id}`}
                      type="number"
                      step="0.1"
                      value={row.doseMg}
                      onChange={(e) => updateDoseRow(row.id, "doseMg", e.target.value)}
                      placeholder="Ex: 2.5"
                      className="print:text-sm"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeDoseRow(row.id)}
                    disabled={doseRows.length === 1}
                    className="print:hidden"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Button
              variant="outline"
              className="w-full mt-4 print:hidden"
              onClick={addDoseRow}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Período
            </Button>

            <Button
              className="w-full mt-6 text-lg py-6 print:hidden"
              onClick={calculateDoses}
            >
              <Calculator className="w-5 h-5 mr-2" />
              Calcular Doses
            </Button>
          </CardContent>
        </Card>

        {/* Card 3: Resultados */}
        {showResults && results.length > 0 && (
          <Card className="shadow-lg border-primary/20 print:shadow-none print:break-before-page">
            <CardHeader className="bg-primary/5 print:py-2">
              <CardTitle className="text-2xl print:text-lg">Resultados do Cálculo</CardTitle>
              <CardDescription className="print:text-xs">
                Volumes a serem aspirados na seringa de insulina
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 print:pt-2">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold print:text-xs">Período</TableHead>
                      <TableHead className="font-bold text-right print:text-xs">Dose (mg)</TableHead>
                      <TableHead className="font-bold text-right print:text-xs">Volume (mL)</TableHead>
                      <TableHead className="font-bold text-right print:text-xs">Volume (UI)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result, index) => (
                      <TableRow key={index} className="hover:bg-muted/50 print:text-sm">
                        <TableCell className="font-medium">{result.period}</TableCell>
                        <TableCell className="text-right">{result.doseMg.toFixed(1)}</TableCell>
                        <TableCell className="text-right">
                          <span className="font-bold text-primary text-lg print:text-sm">
                            {result.volumeMl.toFixed(3)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-bold text-emerald-600 text-lg print:text-sm">
                            {result.volumeUi}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 p-4 bg-muted/30 rounded-lg print:mt-2 print:p-2">
                <p className="text-sm text-muted-foreground print:text-xs">
                  <strong>Nota:</strong> Os valores em mL são arredondados para 3 casas decimais. 
                  Os valores em UI (Unidades de Insulina) são arredondados para o inteiro mais próximo, 
                  considerando que 1 mL = 100 UI em seringas padrão.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground print:mt-4 print:text-xs">
          <p>© 2025 Calculadora de Doses de Insulina. Desenvolvido para auxiliar profissionais de saúde.</p>
        </div>
      </div>
    </div>
  );
}
