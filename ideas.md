# Design Ideas - Calculadora de Doses de Insulina

## Estilo Visual Escolhido

### Paleta de Cores
- **Tema**: Light (fundo claro)
- **Cores principais**: 
  - Azul médico/hospitalar (confiança, profissionalismo): `#0ea5e9` (sky-500)
  - Verde para confirmações e resultados positivos: `#10b981` (emerald-500)
  - Cinza neutro para textos e bordas: `#64748b` (slate-500)
- **Background**: Branco com gradiente sutil azul claro
- **Cartões**: Fundo branco com sombras suaves

### Tipografia
- **Fonte principal**: Inter (Google Fonts) - moderna, legível, profissional
- **Tamanhos**:
  - Títulos: text-2xl / text-3xl (bold)
  - Subtítulos: text-lg (semibold)
  - Corpo: text-base
  - Números importantes: text-xl / text-2xl (bold) para destacar volumes calculados

### Layout
- **Estrutura**: Layout de coluna única centralizado com cards separados
- **Seções**:
  1. Header com título e disclaimer
  2. Card de configuração do medicamento
  3. Card de protocolo de doses
  4. Card de resultados (destaque visual)
- **Espaçamento**: Generoso (p-6, gap-6) para facilitar leitura
- **Bordas**: Arredondadas (rounded-lg) para visual amigável
- **Sombras**: Suaves (shadow-md) para profundidade

### Elementos Visuais
- **Ícones**: Lucide-react (Syringe, Calculator, AlertCircle, Plus, Trash2)
- **Inputs**: Bordas definidas, focus ring azul, labels claras
- **Tabela de resultados**: Zebra striping, destaque em hover
- **Botões**: 
  - Primário: Azul (calcular)
  - Secundário: Outline (adicionar linha)
  - Destrutivo: Vermelho (remover linha)

### Responsividade
- **Mobile-first**: Design otimizado para telas pequenas
- **Breakpoints**: 
  - Mobile: coluna única
  - Tablet/Desktop: max-w-4xl centralizado

### Micro-interações
- Transições suaves em hover
- Animação de fade-in nos resultados
- Feedback visual ao adicionar/remover linhas
- Toast notifications para validações

## Disclaimer Médico
Posicionamento: Banner fixo no topo com ícone de alerta, fundo amarelo claro, texto em destaque.

Texto: "⚠️ AVISO: Esta ferramenta é apenas um auxiliar de cálculo. Não substitui orientação médica profissional. Sempre consulte um profissional de saúde antes de administrar medicamentos."
