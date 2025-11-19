import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Calculator, Plus, Trash2, Syringe, RotateCcw, Printer, Moon, Sun, History, ArrowLeftRight, Save, BookOpen } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

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

interface SavedProtocol {
  id: string;
  name: string;
  date: string;
  totalMg: string;
  totalMl: string;
  doseRows: DoseRow[];
  results: CalculatedResult[];
}

const STORAGE_KEY = "calculadora-insulina-data";
const HISTORY_KEY = "calculadora-insulina-history";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  
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
  
  // Estado para histórico
  const [savedProtocols, setSavedProtocols] = useState<SavedProtocol[]>([]);
  const [protocolName, setProtocolName] = useState<string>("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  
  // Estado para calculadora reversa
  const [reverseVolumeMl, setReverseVolumeMl] = useState<string>("");
  const [reverseDoseMg, setReverseDoseMg] = useState<number | null>(null);

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
    
    // Carregar histórico
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) {
      try {
        const parsed: SavedProtocol[] = JSON.parse(savedHistory);
        setSavedProtocols(parsed);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
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

  // Função para salvar protocolo no histórico
  const saveProtocolToHistory = () => {
    if (results.length === 0) {
      toast.error("Calcule as doses antes de salvar o protocolo.");
      return;
    }
    
    if (!protocolName.trim()) {
      toast.error("Por favor, insira um nome para o protocolo.");
      return;
    }
    
    const newProtocol: SavedProtocol = {
      id: Date.now().toString(),
      name: protocolName.trim(),
      date: new Date().toLocaleString('pt-BR'),
      totalMg,
      totalMl,
      doseRows: [...doseRows],
      results: [...results],
    };
    
    const updatedProtocols = [newProtocol, ...savedProtocols];
    setSavedProtocols(updatedProtocols);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedProtocols));
    
    setProtocolName("");
    setShowSaveDialog(false);
    toast.success(`Protocolo "${newProtocol.name}" salvo com sucesso!`);
  };

  // Função para carregar protocolo do histórico
  const loadProtocolFromHistory = (protocol: SavedProtocol) => {
    setTotalMg(protocol.totalMg);
    setTotalMl(protocol.totalMl);
    setDoseRows(protocol.doseRows);
    setResults(protocol.results);
    setShowResults(true);
    toast.success(`Protocolo "${protocol.name}" carregado!`);
  };

  // Função para deletar protocolo do histórico
  const deleteProtocolFromHistory = (id: string) => {
    const updatedProtocols = savedProtocols.filter(p => p.id !== id);
    setSavedProtocols(updatedProtocols);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedProtocols));
    toast.success("Protocolo removido do histórico.");
  };

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

  // Função para calcular dose reversa
  const calculateReverseDose = () => {
    const mg = parseFloat(totalMg);
    const ml = parseFloat(totalMl);
    const volume = parseFloat(reverseVolumeMl);

    if (!mg || !ml || mg <= 0 || ml <= 0) {
      toast.error("Por favor, configure a concentração do medicamento primeiro.");
      return;
    }

    if (!volume || volume <= 0) {
      toast.error("Por favor, insira um volume válido.");
      return;
    }

    // Calcular concentração (mg/mL)
    const concentration = mg / ml;
    
    // Dose (mg) = Volume (mL) × Concentração (mg/mL)
    const dose = volume * concentration;
    
    setReverseDoseMg(parseFloat(dose.toFixed(2)));
    toast.success("Dose calculada com sucesso!");
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
            <img 
              src="/logo-clinica.png" 
              alt="Logo da Clínica" 
              className="w-16 h-16 object-contain print:w-12 print:h-12"
            />
            <h1 className="text-4xl font-bold text-foreground print:text-2xl">
              Calculadora de Doses
            </h1>
          </div>
          <p className="text-muted-foreground text-lg print:text-sm">
            Automatize o cálculo da dose a ser aspirada em seringa de insulina
          </p>
        </div>

        {/* Disclaimer médico */}
        <Alert className="mb-8 bg-yellow-50 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-800 print:mb-4">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200 font-medium print:text-xs">
            <strong>⚠️ AVISO IMPORTANTE:</strong> Esta ferramenta é apenas um auxiliar de cálculo. 
            Não substitui orientação médica profissional. Sempre consulte um profissional de saúde 
            antes de administrar medicamentos.
          </AlertDescription>
        </Alert>

        {/* Botões de ação no topo */}
        <div className="flex gap-3 mb-6 print:hidden flex-wrap">
          <Button
            variant="outline"
            onClick={resetAllData}
            className="flex-1 min-w-[140px]"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Limpar Tudo
          </Button>
          <Button
            variant="outline"
            onClick={printResults}
            className="flex-1 min-w-[140px]"
            disabled={!showResults}
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
          <Button
            variant="outline"
            onClick={toggleTheme}
            className="flex-1 min-w-[140px]"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
            {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
          </Button>
        </div>

        {/* Tabs para diferentes funcionalidades */}
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 print:hidden">
            <TabsTrigger value="calculator">
              <Calculator className="w-4 h-4 mr-2" />
              Calculadora
            </TabsTrigger>
            <TabsTrigger value="reverse">
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Reversa
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="w-4 h-4 mr-2" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="manual">
              <BookOpen className="w-4 h-4 mr-2" />
              Manual
            </TabsTrigger>
          </TabsList>

          {/* Tab: Calculadora Principal */}
          <TabsContent value="calculator" className="space-y-6">
            {/* Card 1: Configuração do Medicamento */}
            <Card className="shadow-md print:shadow-none">
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
            <Card className="shadow-md print:shadow-none">
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

                <div className="flex gap-3 mt-6 print:hidden">
                  <Button
                    className="flex-1 text-lg py-6"
                    onClick={calculateDoses}
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    Calcular Doses
                  </Button>
                  
                  <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-lg py-6"
                        disabled={!showResults}
                      >
                        <Save className="w-5 h-5 mr-2" />
                        Salvar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Salvar Protocolo</DialogTitle>
                        <DialogDescription>
                          Dê um nome para este protocolo para salvá-lo no histórico
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="protocolName">Nome do Protocolo</Label>
                          <Input
                            id="protocolName"
                            value={protocolName}
                            onChange={(e) => setProtocolName(e.target.value)}
                            placeholder="Ex: Protocolo Inicial - Janeiro 2025"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={saveProtocolToHistory}>
                          Salvar Protocolo
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Resultados */}
            {showResults && results.length > 0 && (
              <Card className="shadow-lg border-primary/20 print:shadow-none">
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
                              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg print:text-sm">
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
          </TabsContent>

          {/* Tab: Calculadora Reversa */}
          <TabsContent value="reverse">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowLeftRight className="w-5 h-5" />
                  Calculadora Reversa
                </CardTitle>
                <CardDescription>
                  Calcule a dose em mg a partir do volume aspirado na seringa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Configure primeiro a concentração do medicamento na aba "Calculadora"
                  </AlertDescription>
                </Alert>

                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Concentração atual:</p>
                  <p className="text-xl font-bold text-primary">
                    {concentration} mg/mL
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reverseVolume" className="text-base font-semibold">
                    Volume Aspirado (mL)
                  </Label>
                  <Input
                    id="reverseVolume"
                    type="number"
                    step="0.001"
                    value={reverseVolumeMl}
                    onChange={(e) => setReverseVolumeMl(e.target.value)}
                    className="text-lg"
                    placeholder="Ex: 0.097"
                  />
                </div>

                <Button
                  className="w-full text-lg py-6"
                  onClick={calculateReverseDose}
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Calcular Dose
                </Button>

                {reverseDoseMg !== null && (
                  <div className="p-6 bg-emerald-50 dark:bg-emerald-950 rounded-lg border-2 border-emerald-300 dark:border-emerald-800">
                    <p className="text-sm text-muted-foreground mb-2">Dose calculada:</p>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {reverseDoseMg.toFixed(2)} mg
                    </p>
                    <p className="text-sm text-muted-foreground mt-4">
                      Com {reverseVolumeMl} mL aspirado, você administrará {reverseDoseMg.toFixed(2)} mg do medicamento.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Histórico */}
          <TabsContent value="history">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Histórico de Protocolos
                </CardTitle>
                <CardDescription>
                  Visualize e carregue protocolos salvos anteriormente
                </CardDescription>
              </CardHeader>
              <CardContent>
                {savedProtocols.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Nenhum protocolo salvo ainda. Calcule doses e clique em "Salvar" para criar um histórico.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedProtocols.map((protocol) => (
                      <Card key={protocol.id} className="border-2">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{protocol.name}</CardTitle>
                              <CardDescription className="text-xs mt-1">
                                Salvo em: {protocol.date}
                              </CardDescription>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteProtocolFromHistory(protocol.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Concentração:</span>
                              <span className="font-semibold ml-2">
                                {(parseFloat(protocol.totalMg) / parseFloat(protocol.totalMl)).toFixed(2)} mg/mL
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Períodos:</span>
                              <span className="font-semibold ml-2">{protocol.results.length}</span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => loadProtocolFromHistory(protocol)}
                          >
                            Carregar Protocolo
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Manual de Instruções */}
          <TabsContent value="manual">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Manual de Instruções
                </CardTitle>
                <CardDescription>
                  Guia completo para usar todas as funcionalidades do aplicativo
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <div className="space-y-6">
                  {/* Introdução */}
                  <section>
                    <h2 className="text-xl font-bold text-foreground mb-3">Introdução</h2>
                    <p className="text-muted-foreground">
                      A <strong>Calculadora de Doses</strong> é uma ferramenta desenvolvida para auxiliar profissionais 
                      de saúde no cálculo preciso de doses de medicamentos a serem aspiradas em seringas de insulina. 
                      O aplicativo automatiza cálculos complexos, reduzindo o risco de erros.
                    </p>
                  </section>

                  {/* Aviso */}
                  <Alert className="bg-yellow-50 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-800">
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                    <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                      <strong>⚠️ AVISO:</strong> Esta ferramenta é apenas um auxiliar de cálculo. NÃO substitui 
                      orientação médica profissional. Sempre consulte um profissional de saúde antes de administrar medicamentos.
                    </AlertDescription>
                  </Alert>

                  {/* Como Usar - Calculadora Principal */}
                  <section>
                    <h2 className="text-xl font-bold text-foreground mb-3">Como Usar a Calculadora Principal</h2>
                    
                    <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">1. Configurar a Concentração</h3>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Insira a <strong>Quantidade Total (mg)</strong> do medicamento</li>
                      <li>Insira o <strong>Volume Total (mL)</strong></li>
                      <li>A concentração será calculada automaticamente em mg/mL</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">2. Configurar o Protocolo de Doses</h3>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Configure o nome de cada período (ex: "Mês 1", "Semana 1")</li>
                      <li>Insira a dose desejada em miligramas para cada período</li>
                      <li>Use <strong>"+ Adicionar Período"</strong> para criar novas linhas</li>
                      <li>Use o botão de lixeira para remover períodos</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">3. Calcular e Interpretar</h3>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Clique em <strong>"Calcular Doses"</strong></li>
                      <li>Os resultados mostrarão o volume em <strong>mL</strong> (3 casas decimais)</li>
                      <li>E também em <strong>UI</strong> (Unidades de Insulina, arredondado)</li>
                      <li>Padrão: 1 mL = 100 UI</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">4. Salvar Protocolo</h3>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Após calcular, clique em <strong>"Salvar"</strong></li>
                      <li>Dê um nome descritivo ao protocolo</li>
                      <li>O protocolo ficará disponível na aba "Histórico"</li>
                    </ul>
                  </section>

                  {/* Calculadora Reversa */}
                  <section>
                    <h2 className="text-xl font-bold text-foreground mb-3">Calculadora Reversa</h2>
                    <p className="text-muted-foreground mb-2">
                      Use esta função para calcular a dose em mg a partir de um volume já aspirado:
                    </p>
                    <ol className="list-decimal pl-6 space-y-1 text-muted-foreground">
                      <li>Vá para a aba <strong>"Reversa"</strong></li>
                      <li>Certifique-se de que a concentração está configurada</li>
                      <li>Insira o volume aspirado em mL</li>
                      <li>Clique em <strong>"Calcular Dose"</strong></li>
                      <li>O resultado mostrará a dose em mg</li>
                    </ol>
                  </section>

                  {/* Histórico */}
                  <section>
                    <h2 className="text-xl font-bold text-foreground mb-3">Gerenciar Histórico</h2>
                    <p className="text-muted-foreground mb-2">
                      Na aba <strong>"Histórico"</strong> você pode:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li><strong>Visualizar</strong> todos os protocolos salvos</li>
                      <li><strong>Carregar</strong> um protocolo clicando em "Carregar Protocolo"</li>
                      <li><strong>Deletar</strong> protocolos usando o ícone de lixeira</li>
                    </ul>
                  </section>

                  {/* Recursos Adicionais */}
                  <section>
                    <h2 className="text-xl font-bold text-foreground mb-3">Recursos Adicionais</h2>
                    
                    <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">Salvamento Automático</h3>
                    <p className="text-muted-foreground">
                      Seus dados são salvos automaticamente enquanto você digita. Ao reabrir o aplicativo, 
                      os últimos dados inseridos serão carregados.
                    </p>

                    <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">Limpar Dados</h3>
                    <p className="text-muted-foreground">
                      Use o botão <strong>"Limpar Tudo"</strong> para resetar todos os campos para os valores padrão. 
                      O histórico de protocolos salvos não será afetado.
                    </p>

                    <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">Imprimir Resultados</h3>
                    <p className="text-muted-foreground">
                      Clique em <strong>"Imprimir"</strong> para gerar uma versão otimizada para impressão. 
                      Você pode imprimir em papel ou salvar como PDF.
                    </p>

                    <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">Modo Escuro</h3>
                    <p className="text-muted-foreground">
                      Alterne entre modo claro e escuro usando o botão no topo da página. 
                      Ideal para uso em ambientes com pouca luz.
                    </p>
                  </section>

                  {/* Fórmulas */}
                  <section>
                    <h2 className="text-xl font-bold text-foreground mb-3">Fórmulas Utilizadas</h2>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <p className="font-mono text-sm">
                        <strong>Concentração:</strong> mg/mL = Quantidade Total (mg) ÷ Volume Total (mL)
                      </p>
                      <p className="font-mono text-sm">
                        <strong>Volume (mL):</strong> mL = Dose (mg) ÷ Concentração (mg/mL)
                      </p>
                      <p className="font-mono text-sm">
                        <strong>Volume (UI):</strong> UI = Volume (mL) × 100
                      </p>
                      <p className="font-mono text-sm">
                        <strong>Dose Reversa:</strong> mg = Volume (mL) × Concentração (mg/mL)
                      </p>
                    </div>
                  </section>

                  {/* Exemplo Prático */}
                  <section>
                    <h2 className="text-xl font-bold text-foreground mb-3">Exemplo Prático</h2>
                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                      <p className="font-semibold text-foreground mb-2">Cenário:</p>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li>Medicamento: 90 mg em 3,5 mL</li>
                        <li>Dose desejada: 2,5 mg</li>
                      </ul>
                      <p className="font-semibold text-foreground mt-3 mb-2">Cálculo:</p>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li>Concentração: 90 ÷ 3,5 = 25,71 mg/mL</li>
                        <li>Volume: 2,5 ÷ 25,71 = 0,097 mL</li>
                        <li>Em UI: 0,097 × 100 = 9,7 ≈ <strong>10 UI</strong></li>
                      </ul>
                      <p className="font-semibold text-primary mt-3">
                        Resultado: Aspirar 0,097 mL ou aproximadamente 10 UI
                      </p>
                    </div>
                  </section>

                  {/* Perguntas Frequentes */}
                  <section>
                    <h2 className="text-xl font-bold text-foreground mb-3">Perguntas Frequentes</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground">Por que 1 mL = 100 UI?</h4>
                        <p className="text-muted-foreground text-sm">
                          Este é o padrão para seringas de insulina U-100, as mais comumente utilizadas.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-foreground">Meus dados estão seguros?</h4>
                        <p className="text-muted-foreground text-sm">
                          Sim. Todos os dados são armazenados localmente no seu navegador. Nenhuma informação 
                          é enviada para servidores externos.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-foreground">Funciona offline?</h4>
                        <p className="text-muted-foreground text-sm">
                          O aplicativo requer internet para carregar, mas os dados salvos ficam disponíveis 
                          localmente após o carregamento inicial.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-foreground">Funciona em celular?</h4>
                        <p className="text-muted-foreground text-sm">
                          Sim! O aplicativo é totalmente responsivo e funciona em smartphones, tablets e computadores.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Glossário */}
                  <section>
                    <h2 className="text-xl font-bold text-foreground mb-3">Glossário</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <strong className="text-foreground">mg:</strong>
                        <span className="text-muted-foreground text-sm ml-2">Miligrama (0,001 gramas)</span>
                      </div>
                      <div>
                        <strong className="text-foreground">mL:</strong>
                        <span className="text-muted-foreground text-sm ml-2">Mililitro (0,001 litros)</span>
                      </div>
                      <div>
                        <strong className="text-foreground">UI:</strong>
                        <span className="text-muted-foreground text-sm ml-2">Unidades de Insulina</span>
                      </div>
                      <div>
                        <strong className="text-foreground">Concentração:</strong>
                        <span className="text-muted-foreground text-sm ml-2">Quantidade por volume (mg/mL)</span>
                      </div>
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground print:mt-4 print:text-xs">
          <p>© 2025 Calculadora de Doses</p>
          <p className="mt-1">Desenvolvido por <strong className="text-foreground">Dr. Gustavo Avelar</strong></p>
        </div>
      </div>
    </div>
  );
}
