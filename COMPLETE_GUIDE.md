# 📚 Guia Completo - FastMCP Builder & OpenAI Apps SDK

## 🎯 Visão Geral

Este projeto é um **sistema completo de criação de aplicações MCP** (Model Context Protocol) que seguem as **guidelines oficiais da OpenAI Apps SDK**. Ele automatiza todo o processo desde o planejamento até o deploy, garantindo compliance e best practices.

### O que este projeto faz?

1. **Questiona** o desenvolvedor sobre a ideia do app seguindo framework OpenAI
2. **Gera** código completo (servidor MCP, templates, configs)
3. **Valida** conformidade com 21 checks de compliance OpenAI
4. **Deploya** localmente ou para produção em minutos

---

## 🏗️ Arquitetura do Sistema

```
agente_git/
├── create-fastmcp-app.sh          # 🎨 Builder interativo (wizard de 3 passos)
├── deploy-fastmcp.sh              # 🚀 Deploy automation (local/package/config)
│
├── server/                        # 📦 Exemplo: Bible Daily App
│   └── src/
│       ├── index-fastmcp.ts       # Servidor MCP compliant
│       └── bible-data.ts          # Lógica de negócio
│
├── builder/                       # 🛠️ Sistema de build
│   └── src/
│       ├── openai-compliance.ts   # Validador de compliance (21 checks)
│       ├── agents.ts              # Sistema de agentes especializados
│       ├── golden-prompts.ts      # Prompts otimizados
│       └── validate.ts            # Validação de schemas
│
├── templates/                     # 📄 Templates para apps gerados
│   ├── openai-compliant-server.ts
│   └── openai-compliant-readme.md
│
├── docs/                          # 📖 Documentação detalhada
│   ├── QUICKSTART.md
│   ├── AGENT_ORCHESTRATION.md
│   └── TUNNELS_SETUP.md
│
└── workflows/                     # 🔄 Workflows de automação
    ├── antigravity/               # Google AntiGravity
    ├── cursor/                    # Cursor AI
    └── claude-hooks/              # Claude MCP hooks
```

---

## 📝 Framework de Planejamento OpenAI

O builder segue **exatamente** o framework recomendado em:
https://developers.openai.com/apps-sdk/plan/use-case

### PASSO 1: Define the Use Case

**Perguntas do builder:**
1. Qual problema seu app resolve?
2. Quem é o usuário-alvo?
3. Nome do app
4. Descrição curta
5. **🆕 O app terá interface visual?**
   - Se sim: tipo (widget/canvas/form/mista)
   - Componentes necessários (tabelas, gráficos, etc.)
   - Criar agente de UI Guidelines? ✨

**Alinhamento OpenAI:**
- ✅ Define problema claro
- ✅ Identifica usuário específico
- ✅ Planeja experiência visual (UI Guidelines)

### PASSO 2: Identify Capabilities (Tools)

**Perguntas do builder:**
1. Quantas tools? (limitado a 1-3 - FastMCP best practice)
2. Para cada tool:
   - Nome da tool
   - Descrição (o que faz?)
   - Parâmetros (separados por vírgula ou 'nenhum')

**Alinhamento OpenAI:**
- ✅ 1 tool = 1 intention (clara e focada)
- ✅ Limita a 3 tools (evita complexidade)
- ✅ Define interfaces claras

### PASSO 3: Sistema de Agentes (Opcional)

**Perguntas do builder:**
1. Usar sistema de agentes?
2. **Agente de UI Guidelines (auto-incluído se tem interface)**
3. Quantos agentes adicionais? (0-3)
4. Para cada agente:
   - Nome do agente
   - Função/especialidade

**Alinhamento OpenAI:**
- ✅ Orchestration quando necessário
- ✅ Golden prompts para especialização
- ✅ Agente dedicado a UI Guidelines

---

## 🔧 Implementação MCP

Nosso código segue **100%** os requisitos de:
https://developers.openai.com/apps-sdk/build/mcp-server

### Checklist de Compliance MCP

| Requisito | Implementação | Arquivo |
|-----------|---------------|---------|
| **MCP SDK** | `@modelcontextprotocol/sdk` v1.25.1 | package.json |
| **Server class** | `new Server({ name, version }, { capabilities })` | index-fastmcp.ts:40 |
| **StdioTransport** | `new StdioServerTransport()` | index-fastmcp.ts:198 |
| **Capabilities** | `capabilities: { tools: {} }` | index-fastmcp.ts:48 |
| **ListTools** | `setRequestHandler(ListToolsRequestSchema)` | index-fastmcp.ts:56 |
| **CallTool** | `setRequestHandler(CallToolRequestSchema)` | index-fastmcp.ts:96 |
| **Zod Schemas** | Schema explícito para cada tool | index-fastmcp.ts:22-35 |
| **Error Handling** | `try-catch` + `isError: true` | index-fastmcp.ts:170 |
| **Input Validation** | `Schema.parse(args)` antes de executar | index-fastmcp.ts:100 |
| **Metadata** | `name` e `version` corretos | index-fastmcp.ts:40 |

### Exemplo de Tool Compliant

```typescript
// 1. Schema Zod explícito
const ObterVersiculoPorLivroSchema = z.object({
  livro: z.string().describe("Nome do livro da Bíblia (ex: João, Salmos)"),
});

// 2. Registrar no ListTools
{
  name: "obter_versiculo_por_livro",
  description: "Obtém um versículo aleatório de um livro específico",
  inputSchema: zodToJsonSchema(ObterVersiculoPorLivroSchema)
}

// 3. Implementar no CallTool
case "obter_versiculo_por_livro": {
  const validated = ObterVersiculoPorLivroSchema.parse(args); // Validação
  const verse = getVerseFromBook(validated.livro);
  
  if (!verse) {
    return {
      content: [{ type: "text", text: `❌ Livro não encontrado` }],
      isError: true  // Error handling
    };
  }
  
  return {
    content: [{ type: "text", text: formatVerse(verse) }]
  };
}
```

---

## 🎨 UI Guidelines OpenAI

Quando o usuário escolhe interface visual, incluímos automaticamente o **UIGuidelinesAgent** que segue:
https://developers.openai.com/apps-sdk/concepts/ui-guidelines

### Princípios do Agente de UI

1. **Usar widgets nativos do ChatGPT quando possível**
   - Evita código customizado desnecessário
   - Garante consistência visual
   - Melhor performance

2. **Design responsivo e acessível**
   - Funciona em mobile e desktop
   - ARIA labels para screen readers
   - Contraste adequado

3. **Performance otimizada (<100ms render)**
   - Lazy loading de componentes
   - Virtualização para listas grandes
   - Memoização de cálculos

4. **Seguir patterns do ChatGPT**
   - Cores, tipografia, spacing do ChatGPT
   - Componentes reconhecíveis
   - Interações consistentes

### Tipos de Interface Suportados

| Tipo | Uso | Exemplos |
|------|-----|----------|
| **Widget** | Exibir dados estruturados | Cards, listas, tabelas |
| **Canvas** | Visualizações customizadas | Gráficos, diagramas, mapas |
| **Form** | Entrada de dados | Formulários, configurações |
| **Mista** | Combinação de tipos | Dashboard complexo |

---

## 🚀 Deploy Automation

O script `deploy-fastmcp.sh` implementa 100% os requisitos de:
https://developers.openai.com/apps-sdk/deploy

### 3 Modos de Deploy

#### 1. Local (Desenvolvimento)

```bash
./deploy-fastmcp.sh local
```

**O que faz:**
1. Build do servidor: `npm run build:server`
2. Detecta SO (macOS/Linux/Windows)
3. Gera `mcp_config_local.json` com caminhos absolutos
4. Fornece instruções de cópia

**Resultado:**
```json
{
  "mcpServers": {
    "biblia-diaria": {
      "command": "/usr/bin/node",
      "args": ["/workspaces/agente_git/server/dist/index-fastmcp.js"],
      "env": {}
    }
  }
}
```

#### 2. Package (Distribuição)

```bash
./deploy-fastmcp.sh package
```

**O que faz:**
1. Build do servidor
2. Cria `deploy-package/` com:
   - server/dist/
   - package.json
   - node_modules/ (apenas production)
3. Gera `biblia-diaria-fastmcp.tar.gz`

**Uso:**
- Upload para servidores
- Distribuição para outros devs
- Deploy em cloud providers

#### 3. Config (Referência)

```bash
./deploy-fastmcp.sh config
```

Exibe templates de configuração para local e remoto.

---

## ✅ Validação de Compliance OpenAI

O validador `builder/src/openai-compliance.ts` executa **21 checks** em **6 categorias**:

### 1. Tool Design (5 checks)
- ✅ Máximo de 3 tools por servidor
- ✅ Cada tool tem 1 intenção clara
- ✅ Nome de tool sem espaços
- ✅ Descrição clara presente
- ✅ Parâmetros com descrição

### 2. Security (4 checks)
- ✅ Validação de input com Zod
- ✅ Error handling com try-catch
- ✅ Sem hardcoded secrets
- ✅ Env vars para configuração sensível

### 3. Privacy (3 checks)
- ✅ Não loga dados pessoais
- ✅ Não persiste dados sensíveis sem consentimento
- ✅ README documenta privacidade

### 4. Annotations (3 checks)
- ✅ Respostas com formato estruturado
- ✅ Metadados quando relevante
- ✅ Status codes corretos

### 5. Documentation (4 checks)
- ✅ README.md completo
- ✅ Instruções de instalação
- ✅ Exemplos de uso
- ✅ Troubleshooting

### 6. Performance (2 checks)
- ✅ Respostas < 5 segundos
- ✅ Streaming para respostas longas

### Executar Validação

```bash
npm run validate:openai
# ou
npm run validate:all
```

**Saída esperada:**
```
✅ Tool Design: 5/5 checks passed
✅ Security: 4/4 checks passed
✅ Privacy: 3/3 checks passed
✅ Annotations: 3/3 checks passed
✅ Documentation: 4/4 checks passed
✅ Performance: 2/2 checks passed

🎉 READY FOR SUBMISSION! (21/21 checks passed)
```

---

## 🎬 Fluxo Completo: Criação de App

### Passo a Passo

1. **Executar Builder**
   ```bash
   ./create-fastmcp-app.sh
   ```

2. **Responder Perguntas (90 segundos)**
   - PASSO 1: Ideia (5 perguntas + UI)
   - PASSO 2: Tools (1-3 tools)
   - PASSO 3: Agentes (opcional + UI agent)

3. **Confirmar e Gerar**
   - Builder gera código em `apps/APP_NAME/`
   - Estrutura completa com server, templates, docs

4. **Build e Validar**
   ```bash
   cd apps/APP_NAME
   npm install
   npm run build:server
   npm run validate:openai
   ```

5. **Deploy Local**
   ```bash
   ./deploy-fastmcp.sh local
   cp mcp_config_local.json ~/.config/OpenAI/ChatGPT/mcp_config.json
   ```

6. **Testar no ChatGPT**
   - Reiniciar ChatGPT Desktop
   - Perguntar algo relacionado ao app
   - Verificar resposta

**Tempo total: ~3 minutos** ⚡

### 🆕 Automação Final (Opcional)

Após a geração, o builder oferece **3 automações**:

#### 1. Criar Repositório Git

```bash
Criar repositório Git? [s/n]: s
```

**O que faz:**
- `git init -b main`
- Cria `.gitignore` otimizado
- Commit inicial com mensagem estruturada
- **Bonus:** Se tem `gh` CLI, oferece criar repo no GitHub

**Resultado:**
```bash
✓ Repositório Git criado
✓ Repositório criado: https://github.com/seu-user/seu-app
```

#### 2. Deploy Automático

```bash
Fazer deploy automático? [s/n]: s
```

**O que faz:**
1. `npm install` (dependências)
2. `npm run build` (build do servidor)
3. Gera `mcp_config_local.json` com caminhos absolutos
4. Detecta SO e mostra caminho de instalação

**Resultado:**
```bash
✓ Dependências instaladas
✓ Build concluído
✓ Configuração gerada: mcp_config_local.json

📝 Para ativar no ChatGPT Desktop:
   cp mcp_config_local.json "$CONFIG_PATH"
   (e reinicie o ChatGPT Desktop)
```

#### 3. Teste via API

```bash
Testar via API? [s/n]: s
```

**O que faz:**
- Cria `tests/api-test.sh` (teste stdio/JSON-RPC)
- Cria `tests/http-test.sh` (teste HTTP/SSE)
- Gera testes para cada tool automaticamente
- Opcionalmente executa os testes

**Resultado:**
```bash
✓ Scripts de teste criados:
   tests/api-test.sh - Teste via stdio (JSON-RPC)
   tests/http-test.sh - Teste via HTTP

Executar teste agora? [s/n]: s

🧪 Executando testes...
📋 Test 1: List available tools
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [...]
  }
}
✅ Tests completed!
```

**Tempo total com automações: ~5 minutos** ⚡

---

## 🔄 Sistema de Agentes

Quando o usuário escolhe agentes, o builder cria um sistema de orquestração baseado em:

### Agente de UI Guidelines (Auto-incluído)

**Função:** Garantir conformidade com OpenAI UI Guidelines

**Golden Prompt:**
```typescript
const uiGuidelinesPrompt = `
Você é um especialista em OpenAI UI Guidelines.
Sua missão: revisar interfaces React e garantir:

1. Uso de widgets nativos quando possível
2. Design responsivo (mobile + desktop)
3. Acessibilidade (ARIA, contraste, keyboard nav)
4. Performance (<100ms render)
5. Consistência com patterns do ChatGPT

Output: Lista de melhorias com prioridade (P0/P1/P2)
`;
```

**Validações automáticas:**
- Verifica uso de componentes customizados vs nativos
- Mede tempo de render (deve ser <100ms)
- Checa ARIA labels
- Valida responsividade

### Agentes Customizados

O usuário pode adicionar até 3 agentes adicionais, como:

**Exemplos:**
- **DataValidationAgent**: Valida schemas e dados de entrada
- **SecurityAuditAgent**: Audita código para vulnerabilidades
- **PerformanceAgent**: Otimiza queries e cache
- **DocumentationAgent**: Gera docs automáticas

---

## 📊 FastMCP Style

### O que é FastMCP?

FastMCP é nossa abordagem opinionated para servidores MCP que prioriza:

1. **1 tool = 1 intention**
   - Cada tool faz UMA coisa clara
   - Sem tools "do_everything"
   - Fácil de entender e manter

2. **Máximo de 3 tools**
   - Força foco no essencial
   - Reduz cognitive load
   - Melhor UX no ChatGPT

3. **Schemas explícitos com Zod**
   - Type-safe input/output
   - Validação automática
   - Auto-documentação

4. **Respostas enxutas**
   - Formato markdown limpo
   - Sem verbosidade desnecessária
   - Emoji para quick scanning

5. **UX nativa do ChatGPT**
   - Usa recursos nativos quando possível
   - Não tenta "hackear" o ChatGPT
   - Segue patterns familiares

### FastMCP vs Tradicional

| Aspecto | Tradicional | FastMCP |
|---------|-------------|---------|
| Tools | 10+ tools | 1-3 tools |
| Design | "do_everything" | 1 tool = 1 intention |
| Validação | Manual | Zod automático |
| Docs | Separadas | Auto-geradas |
| Deploy | Complexo | 1 comando |
| Compliance | Manual | Validação automática |

---

## 🛠️ Scripts Disponíveis

### Builder

```bash
./create-fastmcp-app.sh          # Criar novo app (interativo)
```

### Deploy

```bash
./deploy-fastmcp.sh local        # Deploy local
./deploy-fastmcp.sh package      # Criar tarball
./deploy-fastmcp.sh config       # Ver configs
```

### Validação

```bash
npm run validate:openai          # Validar compliance OpenAI
npm run validate:all             # Todas as validações
npm run build:server             # Build do servidor
npm run start:fastmcp            # Rodar servidor FastMCP
```

---

## 📦 Dependências

### Principais

```json
{
  "@modelcontextprotocol/sdk": "^1.25.1",
  "zod": "^4.2.1",
  "typescript": "^5.7.2"
}
```

### Dev

```json
{
  "@types/node": "^22.10.2",
  "tsx": "^4.19.2"
}
```

---

## 🎓 Recursos de Aprendizado

### Documentação Oficial OpenAI

1. **Planning:** https://developers.openai.com/apps-sdk/plan/use-case
2. **MCP Server:** https://developers.openai.com/apps-sdk/build/mcp-server
3. **UI Guidelines:** https://developers.openai.com/apps-sdk/concepts/ui-guidelines
4. **Deploy:** https://developers.openai.com/apps-sdk/deploy

### Documentação do Projeto

1. [QUICKSTART.md](docs/QUICKSTART.md) - Começar rapidamente
2. [AGENT_ORCHESTRATION.md](docs/AGENT_ORCHESTRATION.md) - Sistema de agentes
3. [FASTMCP_QUICKSTART.md](FASTMCP_QUICKSTART.md) - FastMCP em detalhes
4. [FASTMCP_DEPLOY.md](FASTMCP_DEPLOY.md) - Guia de deploy
5. [OPENAI_GUIDELINES.md](OPENAI_GUIDELINES.md) - Compliance completo

---

## 🚦 Status do Projeto

### ✅ Completo

- [x] Builder interativo (3 passos)
- [x] Validador de compliance (21 checks)
- [x] Deploy automation (3 modos)
- [x] Templates compliant
- [x] Sistema de agentes
- [x] Agente de UI Guidelines
- [x] Exemplo funcional (Bible Daily)
- [x] Documentação completa

### 🎯 Próximos Passos

- [ ] Workflows para AntiGravity (Google)
- [ ] Workflows para Cursor AI
- [ ] Workflows para Claude Hooks
- [ ] CLI tool (npm install -g fastmcp-cli)
- [ ] Marketplace de apps
- [ ] Templates adicionais

---

## 🤝 Contribuindo

Este projeto segue rigorosamente as guidelines OpenAI Apps SDK. Ao contribuir:

1. Execute validação: `npm run validate:all`
2. Garanta 21/21 checks passando
3. Teste deploy local
4. Documente mudanças

---

## 📄 Licença

MIT

---

## 🙋 Suporte

Para questões sobre:
- **FastMCP**: Veja [FASTMCP_QUICKSTART.md](FASTMCP_QUICKSTART.md)
- **Deploy**: Veja [FASTMCP_DEPLOY.md](FASTMCP_DEPLOY.md)
- **Compliance**: Veja [OPENAI_GUIDELINES.md](OPENAI_GUIDELINES.md)
- **Agentes**: Veja [AGENT_ORCHESTRATION.md](docs/AGENT_ORCHESTRATION.md)

---

**Criado com ❤️ seguindo OpenAI Apps SDK Guidelines**
