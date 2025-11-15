# Manual de Instruções - Calculadora de Doses

**Versão 1.0 | Novembro 2025**

---

## Índice

1. [Introdução](#introdução)
2. [Aviso Importante](#aviso-importante)
3. [Funcionalidades Principais](#funcionalidades-principais)
4. [Como Usar a Calculadora Principal](#como-usar-a-calculadora-principal)
5. [Como Usar a Calculadora Reversa](#como-usar-a-calculadora-reversa)
6. [Gerenciamento de Histórico](#gerenciamento-de-histórico)
7. [Recursos Adicionais](#recursos-adicionais)
8. [Perguntas Frequentes](#perguntas-frequentes)
9. [Suporte Técnico](#suporte-técnico)

---

## Introdução

A **Calculadora de Doses** é uma ferramenta web desenvolvida para auxiliar profissionais de saúde no cálculo preciso de doses de medicamentos a serem aspiradas em seringas de insulina. O aplicativo automatiza cálculos complexos, reduzindo o risco de erros e economizando tempo durante a preparação de medicamentos.

### Características Principais

- Interface intuitiva e responsiva (funciona em celular, tablet e computador)
- Cálculos automáticos e precisos
- Conversão automática entre mL e Unidades de Insulina (UI)
- Salvamento automático de dados
- Histórico de protocolos salvos
- Modo claro e escuro
- Função de impressão otimizada
- Calculadora reversa para verificação de doses

---

## Aviso Importante

⚠️ **ATENÇÃO**: Esta ferramenta é apenas um auxiliar de cálculo matemático. **NÃO substitui orientação médica profissional**. Sempre consulte um profissional de saúde qualificado antes de administrar medicamentos. O usuário é responsável por verificar todos os cálculos e doses antes da administração.

---

## Funcionalidades Principais

O aplicativo é organizado em **três abas principais**:

### 1. Calculadora
Ferramenta principal para calcular volumes a serem aspirados com base na concentração do medicamento e no protocolo de doses.

### 2. Reversa
Calculadora inversa que determina a dose em mg a partir do volume aspirado na seringa.

### 3. Histórico
Visualização e gerenciamento de protocolos salvos anteriormente.

---

## Como Usar a Calculadora Principal

### Passo 1: Configurar a Concentração do Medicamento

1. Localize o card **"Concentração do Medicamento"**
2. No campo **"Quantidade Total (mg)"**, insira a quantidade total do medicamento em miligramas
   - Exemplo: `90`
3. No campo **"Volume Total (mL)"**, insira o volume total em mililitros
   - Exemplo: `3.5`
4. A **concentração será calculada automaticamente** e exibida em mg/mL
   - Exemplo: `25.71 mg/mL`

**Nota**: A concentração é calculada pela fórmula: `Concentração = Quantidade Total ÷ Volume Total`

### Passo 2: Configurar o Protocolo de Doses Semanais

1. Localize o card **"Protocolo de Doses Semanais"**
2. O aplicativo vem pré-preenchido com um exemplo de 6 meses
3. Para cada linha, configure:
   - **Período**: Nome do período (ex: "Mês 1", "Semana 1", "1ª Aplicação")
   - **Dose (mg)**: Quantidade da dose em miligramas (ex: `2.5`)

#### Adicionar Mais Períodos
- Clique no botão **"+ Adicionar Período"** para criar uma nova linha
- Uma nova linha será adicionada automaticamente com numeração sequencial

#### Remover Períodos
- Clique no botão vermelho com ícone de lixeira ao lado da linha desejada
- **Importante**: É necessário manter pelo menos uma linha

### Passo 3: Calcular as Doses

1. Após configurar a concentração e o protocolo, clique no botão **"Calcular Doses"**
2. O sistema validará os dados:
   - Concentração válida (valores positivos)
   - Pelo menos uma dose válida no protocolo
3. Se houver erros, uma mensagem de alerta será exibida
4. Se tudo estiver correto, os resultados aparecerão abaixo

### Passo 4: Interpretar os Resultados

A tabela de resultados exibe quatro colunas:

| Coluna | Descrição | Exemplo |
|--------|-----------|---------|
| **Período** | Nome do período configurado | Mês 1 |
| **Dose (mg)** | Dose em miligramas | 2.5 |
| **Volume (mL)** | Volume a aspirar em mililitros (3 casas decimais) | 0.097 |
| **Volume (UI)** | Volume em Unidades de Insulina (arredondado) | 10 |

**Fórmulas utilizadas**:
- Volume (mL) = Dose (mg) ÷ Concentração (mg/mL)
- Volume (UI) = Volume (mL) × 100

**Exemplo prático**:
- Concentração: 25.71 mg/mL
- Dose desejada: 2.5 mg
- Volume calculado: 0.097 mL ou 10 UI

### Passo 5: Salvar o Protocolo (Opcional)

1. Após calcular as doses, clique no botão **"Salvar"** ao lado de "Calcular Doses"
2. Uma janela será aberta solicitando um nome para o protocolo
3. Digite um nome descritivo (ex: "Protocolo Inicial - Janeiro 2025")
4. Clique em **"Salvar Protocolo"**
5. O protocolo será salvo no histórico para consulta futura

---

## Como Usar a Calculadora Reversa

A calculadora reversa é útil para **verificar a dose em mg** quando você já tem um volume específico aspirado na seringa.

### Quando Usar
- Verificar doses já preparadas
- Conferir cálculos manuais
- Determinar a dose de uma seringa pré-preenchida

### Passo a Passo

1. Clique na aba **"Reversa"**
2. Certifique-se de que a concentração do medicamento está configurada (veja a seção "Concentração atual")
3. No campo **"Volume Aspirado (mL)"**, insira o volume em mililitros
   - Exemplo: `0.097`
   - Aceita até 3 casas decimais
4. Clique no botão **"Calcular Dose"**
5. O resultado será exibido em destaque:
   - **Dose calculada em mg**
   - Mensagem explicativa

**Fórmula utilizada**: Dose (mg) = Volume (mL) × Concentração (mg/mL)

**Exemplo**:
- Concentração: 25.71 mg/mL
- Volume aspirado: 0.097 mL
- Dose calculada: **2.50 mg**

---

## Gerenciamento de Histórico

### Visualizar Protocolos Salvos

1. Clique na aba **"Histórico"**
2. Todos os protocolos salvos serão listados em ordem cronológica (mais recentes primeiro)
3. Cada card de protocolo exibe:
   - Nome do protocolo
   - Data e hora em que foi salvo
   - Concentração utilizada
   - Número de períodos configurados

### Carregar um Protocolo

1. Na aba "Histórico", localize o protocolo desejado
2. Clique no botão **"Carregar Protocolo"**
3. O aplicativo retornará à aba "Calculadora" com todos os dados preenchidos:
   - Concentração do medicamento
   - Protocolo de doses
   - Resultados calculados

### Deletar um Protocolo

1. Na aba "Histórico", localize o protocolo desejado
2. Clique no ícone de **lixeira** no canto superior direito do card
3. O protocolo será removido permanentemente do histórico
4. Uma mensagem de confirmação será exibida

**Nota**: A exclusão é permanente e não pode ser desfeita.

---

## Recursos Adicionais

### Salvamento Automático

O aplicativo salva automaticamente seus dados enquanto você digita. Isso significa que:
- Se você fechar o navegador, seus dados serão preservados
- Ao reabrir o aplicativo, os últimos dados inseridos serão carregados automaticamente
- Uma notificação "Dados anteriores carregados com sucesso!" será exibida

### Limpar Todos os Dados

1. Clique no botão **"Limpar Tudo"** no topo da página
2. Todos os campos serão resetados para os valores padrão:
   - Concentração: 90 mg / 3.5 mL
   - Protocolo: 6 meses pré-preenchidos
3. Os dados salvos automaticamente serão removidos
4. **Importante**: O histórico de protocolos salvos NÃO será afetado

### Imprimir Resultados

1. Calcule as doses primeiro
2. Clique no botão **"Imprimir"** no topo da página
3. A janela de impressão do navegador será aberta
4. O layout foi otimizado para impressão:
   - Elementos desnecessários são ocultados
   - Tamanhos de fonte ajustados
   - Cores preservadas para melhor legibilidade
5. Você pode:
   - Imprimir em papel
   - Salvar como PDF (selecione "Salvar como PDF" no destino)

### Alternar Modo Claro/Escuro

1. Clique no botão **"Modo Escuro"** ou **"Modo Claro"** no topo da página
2. A interface alternará entre os dois temas
3. Sua preferência será salva automaticamente
4. Benefícios do modo escuro:
   - Reduz fadiga visual em ambientes com pouca luz
   - Economiza bateria em telas OLED
   - Conforto visual durante uso prolongado

---

## Perguntas Frequentes

### 1. Por que o padrão é 1 mL = 100 UI?

Este é o padrão internacional para seringas de insulina U-100, as mais comumente utilizadas. Se você estiver usando seringas com outra concentração (ex: U-40 ou U-500), os valores em UI precisarão ser ajustados manualmente.

### 2. Posso usar o aplicativo offline?

Não. O aplicativo requer conexão com a internet para funcionar. No entanto, uma vez carregado, os dados salvos localmente permanecerão disponíveis mesmo sem conexão.

### 3. Meus dados estão seguros?

Sim. Todos os dados são armazenados **localmente no seu navegador** (LocalStorage). Nenhuma informação é enviada para servidores externos. Isso significa:
- ✅ Privacidade total
- ✅ Dados acessíveis apenas no seu dispositivo
- ⚠️ Se você limpar os dados do navegador, os dados serão perdidos

### 4. Quantos protocolos posso salvar no histórico?

Não há limite técnico, mas recomendamos manter apenas os protocolos mais relevantes para facilitar a navegação. Você pode deletar protocolos antigos a qualquer momento.

### 5. O que acontece se eu inserir valores inválidos?

O aplicativo possui validações integradas:
- Valores negativos ou zero não são aceitos para concentração e doses
- Campos vazios são ignorados no cálculo
- Mensagens de erro claras são exibidas quando necessário

### 6. Posso editar um protocolo salvo?

Não diretamente. Para modificar um protocolo salvo:
1. Carregue o protocolo do histórico
2. Faça as alterações desejadas
3. Salve como um novo protocolo com nome diferente
4. Delete o protocolo antigo, se desejar

### 7. Como faço backup dos meus protocolos?

Atualmente, o backup deve ser feito manualmente:
- Use a função "Imprimir" e salve como PDF
- Tire screenshots dos protocolos importantes
- Anote os dados em um documento externo

### 8. O aplicativo funciona em celular?

Sim! O aplicativo é totalmente responsivo e funciona perfeitamente em:
- Smartphones (iOS e Android)
- Tablets
- Computadores desktop
- Notebooks

### 9. Preciso criar uma conta para usar?

Não. O aplicativo é totalmente gratuito e não requer cadastro, login ou qualquer tipo de autenticação.

### 10. Como reporto um erro ou sugiro melhorias?

Entre em contato com o desenvolvedor através dos canais de suporte listados na seção abaixo.

---

## Suporte Técnico

### Requisitos do Sistema

- **Navegador**: Chrome, Firefox, Safari ou Edge (versões atualizadas)
- **Conexão**: Internet necessária para carregar o aplicativo
- **JavaScript**: Deve estar habilitado no navegador
- **Cookies/LocalStorage**: Devem estar habilitados para salvamento de dados

### Resolução de Problemas Comuns

#### Os dados não estão sendo salvos
- Verifique se o LocalStorage está habilitado no navegador
- Certifique-se de não estar em modo anônimo/privado
- Limpe o cache do navegador e recarregue a página

#### A calculadora não está funcionando
- Atualize a página (F5 ou Ctrl+R)
- Limpe o cache do navegador
- Tente usar outro navegador
- Verifique sua conexão com a internet

#### Os resultados parecem incorretos
- Verifique se os valores de entrada estão corretos
- Confirme a concentração do medicamento
- Use a calculadora reversa para validar os resultados
- Sempre confira os cálculos com outro método antes de administrar

#### O modo escuro não está funcionando
- Recarregue a página
- Limpe o cache do navegador
- Verifique se o JavaScript está habilitado

### Contato

Para dúvidas, sugestões ou reportar problemas:
- **Email**: [seu-email@exemplo.com]
- **Website**: [seu-website.com]

---

## Glossário

| Termo | Definição |
|-------|-----------|
| **mg** | Miligrama - unidade de massa equivalente a 0,001 gramas |
| **mL** | Mililitro - unidade de volume equivalente a 0,001 litros |
| **UI** | Unidades de Insulina - medida padrão para insulina |
| **Concentração** | Quantidade de substância por unidade de volume (mg/mL) |
| **Protocolo** | Conjunto de doses programadas ao longo do tempo |
| **LocalStorage** | Armazenamento local no navegador para salvar dados |

---

## Histórico de Versões

### Versão 1.0 (Novembro 2025)
- Lançamento inicial
- Calculadora principal com conversão mL/UI
- Calculadora reversa
- Sistema de histórico de protocolos
- Modo claro e escuro
- Função de impressão
- Salvamento automático
- Interface responsiva

---

## Licença e Responsabilidade

Este software é fornecido "como está", sem garantias de qualquer tipo. O desenvolvedor não se responsabiliza por erros de cálculo, uso inadequado ou consequências da administração de medicamentos. O usuário é o único responsável por verificar todos os cálculos e seguir as orientações médicas apropriadas.

**© 2025 Calculadora de Doses. Todos os direitos reservados.**

---

**Desenvolvido para auxiliar profissionais de saúde.**
