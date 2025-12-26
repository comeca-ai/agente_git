# � FastMCP App Builder

**Crie aplicações ChatGPT MCP em minutos!**

Sistema interativo que transforma sua ideia em código FastMCP pronto para deploy, seguindo OpenAI's Apps SDK e guidelines FastMCP.

## ✨ O que é FastMCP?

FastMCP é uma abordagem de design para criar servidores MCP que prioriza:
- **1 tool = 1 intention** (clara e focada)
- **Schemas explícitos** com Zod
- **Respostas enxutas** e previsíveis
- **Deploy simplificado** (local ou ☁️ FastMCP Cloud)
- **UX nativa** do ChatGPT

## ☁️ Novo: FastMCP Cloud Deploy

Agora você pode fazer deploy na **FastMCP Cloud** com 1 comando:

```bash
# Deploy automático durante criação do app
./create-fastmcp-app.sh
# ... responder perguntas ...
# Deploy também no FastMCP Cloud? [s/n]: s
# ✓ Deployed to: https://srv_xyz.fastmcp.com

# Ou deploy manual de apps existentes
./deploy-fastmcp-cloud.sh projetos/seu-app
```

**Benefícios:**
- ✅ Deploy em 2-3 minutos
- ✅ 99.9% uptime SLA
- ✅ Escalabilidade automática
- ✅ Monitoramento integrado
- ✅ SSL/TLS automático

Ver [FASTMCP_CLOUD.md](FASTMCP_CLOUD.md) para detalhes.

## 🎯 Quick Start - Crie Seu App

```bash
# Execute o builder interativo
./create-fastmcp-app.sh
```

O builder vai perguntar:
1. **Qual a ideia do seu app?** (problema, usuário, nome)
2. **Quais tools?** (1-3 funcionalidades)
3. **Precisa de agentes?** (orquestração opcional)
4. **Precisa de widget?** (interface visual opcional)

Em **30 segundos** você terá um app completo e funcional!

## 🎬 Demo: Criando um App

```bash
$ ./create-fastmcp-app.sh

╔══════════════════════════════════════════════════════════╗
║        🚀 FastMCP App Builder                            ║
║        Criador Interativo de Apps MCP                    ║
╚══════════════════════════════════════════════════════════╝

📝 PASSO 1: Defina a ideia do seu app

1. Qual problema seu app resolve? 
> Consultar clima rapidamente

2. Quem é o usuário-alvo? 
> Pessoas planejando o dia

3. Nome do seu app: 
> clima-tempo

4. Descrição curta: 
> Clima em tempo real por cidade

🔧 PASSO 2: Defina as tools

Quantas tools? (1-3): 
> 2

Tool 1/2:
  Nome da tool: obter_clima
  Descrição: Obtém temperatura e condições atuais
  Parâmetros: cidade

Tool 2/2:
  Nome da tool: obter_previsao
  Descrição: Previsão para os próximos dias
  Parâmetros: cidade, dias

🤖 PASSO 3: Sistema de Agentes
Usar sistema de agentes? (s/n): n

🎨 PASSO 4: Interface Visual
Precisa de widget visual? (s/n): n

✅ APP GERADO COM SUCESSO!

📁 Localização: apps/clima-tempo

📝 Próximos passos:
1. cd apps/clima-tempo
2. npm install
3. npm run build
4. npm start
```

**Tempo total: 90 segundos** ⚡

## 🚀 Deploy Instantâneo

```bash
cd apps/clima-tempo
npm install && npm run build

# Gerar config
node -e "console.log(JSON.stringify({
  mcpServers: {
    'clima-tempo': {
      command: 'node',
      args: [process.cwd() + '/server/dist/index.js']
    }
  }
}, null, 2))" > config.json

# Copiar para ChatGPT
cp config.json ~/.config/OpenAI/ChatGPT/mcp_config.json
```

Reinicie ChatGPT e use: *"Qual o clima em São Paulo?"* 🌤️

## 🏗️ Arquitetura FastMCP

```
seu-app/
├── server/              # MCP Server (Backend)
│   ├── src/
│   │   └── index.ts     # Servidor FastMCP com tools
│   └── dist/            # Build output
├── web/                 # React Widget (opcional)
│   ├── src/
│   │   └── App.tsx      # Interface visual
│   └── dist/
├── builder/             # Agentes (opcional)
│   └── src/
│       └── agents.ts    # Orquestração
├── package.json
└── README.md
```

**Simplicidade FastMCP:** Sem Docker, sem containers, apenas Node.js!

## 🛠️ Tech Stack

- **Node.js** 18+ & **TypeScript**
- **@modelcontextprotocol/sdk** - Protocolo MCP
- **Zod** - Validação de schemas
- **React + Vite** - Widget (opcional)
- **@openai/agents** - Orquestração (opcional)

**Foco:** Simplicidade e FastMCP guidelines

## 📝 Scripts Disponíveis

```bash
# Criar novo app interativamente
./create-fastmcp-app.sh

# Build e deploy do exemplo
npm run build:server
./deploy-fastmcp.sh local

# Testar servidor FastMCP
npm run start:fastmcp

# Validar guidelines FastMCP
npm run validate

# Servidor HTTP (alternativa)
npm run start:http
```

## 🚀 Deploy FastMCP (3 Passos)

### Opção 1: Builder Interativo (Recomendado)

```bash
# Crie um novo app do zero
./create-fastmcp-app.sh

# Siga as perguntas interativas
# Seu app estará pronto em segundos!
```

### Opção 2: App de Exemplo (Bible Daily)

```bash
# 1. Build
npm install
npm run build:server

# 2. Deploy local
./deploy-fastmcp.sh local

# 3. Configurar no ChatGPT Desktop
cp mcp_config_local.json ~/.config/OpenAI/ChatGPT/mcp_config.json
```

Reinicie o ChatGPT Desktop e pronto!

### Configuração Manual

**macOS:** `~/Library/Application Support/OpenAI/ChatGPT/mcp_config.json`  
**Linux:** `~/.config/OpenAI/ChatGPT/mcp_config.json`  
**Windows:** `%APPDATA%\OpenAI\ChatGPT\mcp_config.json`

```json
{
  "mcpServers": {
    "biblia-diaria": {
      "command": "node",
      "args": ["/caminho/completo/server/dist/index-fastmcp.js"],
      "env": {}
    }
  }
}
```

**Nota:** Substitua `/workspaces/agente_git` pelo caminho absoluto onde você clonou este repositório.

3. **Reinicie o ChatGPT Desktop**

4. **Verifique a conexão:**
   - O servidor MCP "biblia-diaria" aparecerá disponível
   - Você pode testar com: "Me dê um versículo para hoje"

### Running the MCP Server (Standalone)

```bash
npm run start:server
```

The server runs on stdio and communicates via the MCP protocol.

### Testing with MCP Inspector

Use the official MCP Inspector to test the server:

```bash
npx @modelcontextprotocol/inspector node server/dist/index.js
```

### Development Mode

```bash
# Watch mode for server
npm run dev:server

# Dev mode for widget (HMR)
npm run dev:web
```

## 📋 Available Tools

The app provides 3 tools following FastMCP style (1 tool = 1 intention):

### 1. `obter_versiculo_diario`
- **Purpose:** Get a random daily Bible verse
- **Input:** None
- **Output:** Random verse from any book
- **Annotations:** `readOnlyHint: true`
- **Use Case:** "Me dê um versículo para hoje"

### 2. `obter_versiculo_por_livro`
- **Purpose:** Get a verse from a specific book
- **Input:** `livro` (book name, e.g., "João", "Salmos")
- **Output:** Random verse from specified book
- **Annotations:** `readOnlyHint: true`
- **Use Case:** "Quero um versículo de Salmos"

### 3. `listar_livros_disponiveis`
- **Purpose:** List all available Bible books
- **Input:** None
- **Output:** Array of book names
- **Annotations:** `readOnlyHint: true`
- **Use Case:** "Quais livros da Bíblia você tem?"

## 📊 Agent System

The project includes a complete agent orchestration system following the pattern from `orientacoes`:

### Specialized Agents

1. **Spec Agent (PM)** - Transforms ideas into AppSpec JSON
2. **MCP Designer** - Designs tools in FastMCP style
3. **Backend Agent** - Implements MCP server
4. **Widget Agent** - Implements React widget
5. **QA Agent** - Validates builds and tests
6. **Compliance Agent** - Checks Apps SDK guidelines
7. **Orchestrator** - Coordinates all agents with handoffs

### Running Validation

```bash
# Run validation report
node builder/src/validate.ts
```

## ✅ Compliance Checklist

### FastMCP Compliance
- ✅ 1 tool = 1 clear intention
- ✅ Tools are clearly named (verb_object pattern)
- ✅ Explicit schemas (Zod validation)
- ✅ Predictable responses
- ✅ No "do_everything" anti-pattern

### Apps SDK Compliance
- ✅ All tools have correct annotations (readOnlyHint)
- ✅ Tool descriptions follow "Use this when..." format
- ✅ Security: No secrets in structuredContent/widgetState/_meta
- ✅ Privacy: Minimal data collection, no PII
- ✅ Widget uses window.openai API correctly
- ✅ Widget state is small (<4k tokens)
- ✅ Server-side validation (defense against prompt injection)
- ✅ CSP policy ready for widget

### MCP Protocol Compliance
- ✅ Implements MCP server with stdio transport
- ✅ registerResource for widget (text/html+skybridge)
- ✅ registerTool for all tools
- ✅ Proper separation of structuredContent and _meta

## 🧪 Testing

### Manual Testing Prompts (Golden Prompts)

Direct requests:
- "Me dê um versículo para hoje"
- "Quero um versículo de Salmos"
- "Quais livros da Bíblia você tem?"

Indirect requests:
- "Preciso de inspiração espiritual"
- "Me ajude com uma palavra da Bíblia"

Negative cases:
- "Quero um versículo de Gênesis" (not available)
- Test error handling

### Automated Testing

```bash
npm test
```

## 📝 Data Model

### Verse Structure

```typescript
interface Verse {
  book: string;      // e.g., "João"
  chapter: number;   // e.g., 3
  verse: number;     // e.g., 16
  text: string;      // Portuguese verse text
}
```

### Available Books

Current dataset includes:
- João (John)
- Salmos (Psalms)
- Provérbios (Proverbs)
- Mateus (Matthew)
- Filipenses (Philippians)
- Romanos (Romans)

## 🔒 Security

- ✅ No API keys or secrets in responses
- ✅ Server-side validation for all inputs
- ✅ Defense against prompt injection
- ✅ Minimal data exposure (least privilege)
- ✅ CSP policy for widget security

## 🎨 Widget Features

- 📖 Clean, readable verse display
- 🔄 Refresh button for new verses
- 📱 Responsive design
- ⚡ Fast loading with Vite
- 🎯 Native ChatGPT integration via window.openai

## 📚 Documentação Completa

### 🚀 Para Começar
- **[GUIA_RAPIDO.md](GUIA_RAPIDO.md)** - Comece aqui! Tutorial de 5 minutos
- **[TEMPLATE_GUIDE.md](TEMPLATE_GUIDE.md)** - Prepare sua ideia antes de criar

### 🛠️ Deploy
- **[FASTMCP_QUICKSTART.md](FASTMCP_QUICKSTART.md)** - Deploy em 3 passos ⭐
- **[FASTMCP_DEPLOY.md](FASTMCP_DEPLOY.md)** - Guia completo de deploy

### 📦 Avançado (Opcional)
- **[DEPLOY_DOCKER_LEGACY.md](DEPLOY_DOCKER_LEGACY.md)** - Docker para cloud (não recomendado)

### ✅ Compliance & Qualidade
- **[OPENAI_GUIDELINES.md](OPENAI_GUIDELINES.md)** - ⭐ Siga as guidelines oficiais da OpenAI
- **[SUBMISSION_PACKAGE.md](SUBMISSION_PACKAGE.md)** - Checklist de submissão

### 📖 Referências
- [OpenAI Apps SDK](https://platform.openai.com/docs/guides/apps)
- [Apps Submission Guidelines](https://developers.openai.com/apps-sdk/app-submission-guidelines) ⭐
- [MCP Protocol](https://modelcontextprotocol.io/)
- [FastMCP Guidelines](https://github.com/modelcontextprotocol/mcp)
- [OpenAI Agents SDK](https://github.com/openai/openai-agents-sdk)

## 🎯 Casos de Uso

### Apps Simples (1 tool)
- **Clima:** Consulta temperatura
- **Notícias:** Busca headlines
- **Definições:** Dicionário rápido

### Apps Intermediários (2-3 tools)
- **Tarefas:** Criar, listar, concluir
- **Finanças:** Registrar, listar, resumir
- **Estudos:** Flashcards, revisar, testar

### Apps Avançados (com agentes)
- **Assistente Pessoal:** Múltiplos especialistas
- **Curadoria:** Filtragem inteligente
- **Análise:** Insights automáticos

## 💡 Por que FastMCP?

| Característica | Abordagem Tradicional | FastMCP |
|---|---|---|
| Setup | Docker, configs, env vars | 1 comando |
| Deploy | CI/CD, cloud, containers | Copia arquivo |
| Complexidade | Alta | Mínima |
| Tempo | Horas/dias | Minutos |
| Aprendizado | Curva íngreme | Imediato |
| Manutenção | Constante | Rara |
| Ideal para | Cloud/produção escalável | ChatGPT Desktop |

## 🏆 Exemplos no Projeto

### Bible Daily (exemplo completo)
```bash
cd /workspaces/agente_git
npm install
npm run start:fastmcp
```

**Features:**
- 3 tools FastMCP
- Schemas Zod
- Deploy simplificado
- Documentação completa

## 🛠️ Scripts Úteis

```bash
# Criar novo app (interativo)
./create-fastmcp-app.sh

# Deploy FastMCP local
./deploy-fastmcp.sh local

# Criar package
./deploy-fastmcp.sh package

# Ver configurações
./deploy-fastmcp.sh config

# Build e teste (exemplo)
npm run build:server
npm run start:fastmcp

# Validar FastMCP guidelines
npm run validate

# Validar OpenAI guidelines ⭐
npm run validate:openai

# Validar tudo (recomendado antes de submeter)
npm run validate:all
```

## ✅ Garantia de Compliance

Apps gerados com FastMCP Builder seguem **automaticamente**:

✅ **OpenAI Apps SDK Guidelines**
- Tool design claro (1 tool = 1 intention)
- Schemas explícitos com Zod
- Error handling adequado
- Security best practices
- Privacy compliant
- Documentação completa

✅ **FastMCP Style**
- Respostas enxutas
- Nomes descritivos
- Máximo 1-3 tools

✅ **MCP Protocol**
- Implementação correta do protocolo
- Transport stdio/SSE
- Handlers apropriados

**Validação:** Execute `npm run validate:all` para verificar compliance completo.

## 🚀 Next Steps for Production

1. **Expand Bible Data**
   - Add complete Bible books
   - Include multiple translations
   - Add verse categorization (themes, topics)

2. **Enhanced Widget**
   - Bookmark favorite verses
   - Share functionality
   - Reading plans

3. **Advanced Features**
   - Search by keyword
   - Verse of the day scheduling
   - Multi-language support

4. **Testing**
   - Complete MCP Inspector validation
   - Golden prompts coverage
   - Integration tests

5. **Submission**
   - Complete CSP policy definition
   - Final security audit
   - Apps SDK submission checklist

## 📄 License

ISC

## 👥 Contributing

This project follows the agent orchestration pattern from OpenAI's guidelines. To contribute:

1. Review the `orientacoes` file for the complete protocol
2. Follow FastMCP style (1 tool = 1 intention)
3. Ensure Apps SDK compliance (annotations, security)
4. Test with MCP Inspector before submitting

---

**Built with ❤️ following OpenAI's Apps SDK + FastMCP + Agent Orchestration guidelines**
