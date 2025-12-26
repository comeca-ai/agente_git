# 📖 Bible Daily App - ChatGPT MCP Application

A ChatGPT App that delivers daily Bible verses for spiritual inspiration, built following OpenAI's Apps SDK, MCP protocol, and FastMCP guidelines.

## 🎯 App Overview

**Problem:** Users want daily spiritual inspiration from Bible verses  
**Solution:** ChatGPT-integrated app that provides random or specific Bible verses on demand  
**Target User:** Anyone seeking daily Bible verses and spiritual guidance

## 🏗️ Architecture

This project follows the official template from OpenAI's guidelines:

```
biblia-diaria-mcp/
├── server/              # MCP Server (Backend)
│   ├── src/
│   │   ├── index.ts     # MCP server with tools
│   │   └── bible-data.ts # Bible verses database
│   └── dist/            # Compiled TypeScript
├── web/                 # React Widget (Frontend)
│   ├── src/
│   │   └── App.tsx      # Main widget component
│   └── dist/            # Built widget bundle
├── builder/             # Agent Orchestration System
│   └── src/
│       ├── agents.ts    # Specialized agents
│       └── validate.ts  # Validation script
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Tech Stack

### Backend (MCP Server)
- **Node.js** 18+
- **TypeScript**
- **@modelcontextprotocol/sdk** - MCP protocol implementation
- **Zod** - Schema validation

### Frontend (Widget)
- **React** - UI framework
- **Vite** - Build tool
- **TypeScript**
- **window.openai** - Native ChatGPT integration

### Orchestration
- **@openai/agents** - Agent coordination system

## 🔧 Installation

### 1. Clone and Install Dependencies

```bash
# Install root dependencies (MCP Server + Agents SDK)
npm install

# Install widget dependencies
cd web && npm install && cd ..
```

### 2. Build the Project

```bash
# Build everything (server + widget)
npm run build

# Or build individually
npm run build:server  # Build TypeScript MCP server
npm run build:web     # Build React widget
```

## 🚀 Usage

### Running the MCP Server

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

## 📚 References

This implementation follows:
- [OpenAI Apps SDK Documentation](https://platform.openai.com/docs/guides/apps)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [FastMCP Style Guide](https://github.com/modelcontextprotocol/mcp)
- [OpenAI Agents SDK](https://github.com/openai/openai-agents-sdk)

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
