# Quick Start Guide - Bible Daily App

## 🚀 Quick Setup (5 minutes)

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/comeca-ai/agente_git.git
cd agente_git

# Install dependencies
npm install
cd web && npm install && cd ..

# Build the project
npm run build
```

### Run the App

#### Option 1: Start MCP Server (for MCP Inspector)

```bash
npm run start:server
```

The server will run on stdio and communicate via MCP protocol.

#### Option 2: Test with MCP Inspector

```bash
npx @modelcontextprotocol/inspector node server/dist/index.js
```

This opens a UI where you can:
- List available tools
- Call tools with test data
- See tool responses
- View widget rendering

### Test the 3 Tools

Once the server is running, test these commands:

#### 1. Get Daily Verse (Random)
```json
{
  "method": "tools/call",
  "params": {
    "name": "obter_versiculo_diario",
    "arguments": {}
  }
}
```

**Expected Response:** Random verse from any book

#### 2. Get Verse from Specific Book
```json
{
  "method": "tools/call",
  "params": {
    "name": "obter_versiculo_por_livro",
    "arguments": {
      "livro": "Salmos"
    }
  }
}
```

**Expected Response:** Random verse from Psalms

#### 3. List Available Books
```json
{
  "method": "tools/call",
  "params": {
    "name": "listar_livros_disponiveis",
    "arguments": {}
  }
}
```

**Expected Response:** List of 6 available books

## 📊 Validation

Run the validation script to see the complete report:

```bash
npx tsx builder/src/validate.ts
```

This shows:
- ✅ All implemented features
- ✅ Compliance checks (FastMCP, Apps SDK)
- ✅ Security validation
- 📋 Next steps for production

## 🧪 Testing

### Golden Prompts Test Suite

```bash
npx tsx builder/src/golden-prompts.ts
```

This displays the complete test suite with:
- Direct requests (natural language)
- Indirect requests
- Negative cases (error handling)
- Edge cases

### Manual Testing with ChatGPT

Once integrated with ChatGPT, users can say:
- "Me dê um versículo para hoje"
- "Quero um versículo de Salmos"
- "Quais livros da Bíblia você tem?"

## 📁 Project Structure

```
biblia-diaria-mcp/
├── server/              # MCP Server (Backend)
│   ├── src/
│   │   ├── index.ts     # MCP server with 3 tools
│   │   └── bible-data.ts # Bible verses database
│   └── dist/            # Compiled TypeScript
├── web/                 # React Widget (Frontend)
│   ├── src/
│   │   └── App.tsx      # Main widget component
│   └── dist/            # Built widget bundle
├── builder/             # Agent Orchestration System
│   └── src/
│       ├── agents.ts    # 7 specialized agents
│       ├── validate.ts  # Validation script
│       └── golden-prompts.ts # Test suite
├── docs/                # Documentation
│   └── AGENT_ORCHESTRATION.md # Agent flow guide
├── package.json         # Root dependencies
└── README.md            # Main documentation
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build server + widget |
| `npm run build:server` | Build TypeScript MCP server |
| `npm run build:web` | Build React widget |
| `npm run start:server` | Start MCP server |
| `npm run dev:server` | Watch mode for server |
| `npm run dev:web` | Dev mode for widget |
| `npm test` | Run tests |

## 🔍 What's Implemented

### ✅ Phase 1: Project Setup
- MCP Server with TypeScript
- React + Vite widget
- OpenAI Agents SDK integration

### ✅ Phase 2: Agent Stack
- 7 specialized agents (Spec, Designer, Backend, Widget, QA, Compliance, Orchestrator)
- Complete orchestration pipeline
- Handoff mechanisms

### ✅ Phase 3: Bible Daily App
- 3 tools (obter_versiculo_diario, obter_versiculo_por_livro, listar_livros_disponiveis)
- All tools have readOnlyHint: true
- Portuguese Bible verses (6 books, 16 verses)
- Widget with window.openai integration

### ✅ Phase 4: Validation & Compliance
- TypeScript builds successfully
- Vite builds successfully
- FastMCP compliance
- Apps SDK compliance
- Security validation

### ✅ Phase 5: Documentation
- Complete README
- Agent orchestration guide
- Golden prompts test suite
- Quick start guide

## 🎯 Next Steps

1. **Test with MCP Inspector**
   - Verify all 3 tools work
   - Test error handling
   - Check widget rendering

2. **Expand Bible Data**
   - Add more books
   - Add more verses
   - Consider multiple translations

3. **ChatGPT Integration**
   - Submit to Apps SDK
   - Test with real users
   - Gather feedback

4. **Production Enhancements**
   - Add CSP policy
   - Implement caching
   - Add analytics (without PII)

## 📚 Resources

- [Main README](../README.md) - Complete documentation
- [Agent Orchestration](../docs/AGENT_ORCHESTRATION.md) - Agent flow details
- [OpenAI Apps SDK](https://platform.openai.com/docs/guides/apps)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [FastMCP Guide](https://github.com/modelcontextprotocol/mcp)

## 🤝 Contributing

This project follows the agent orchestration pattern from OpenAI's guidelines. See `orientacoes` file for the complete protocol.

## 💡 Tips

- **Development:** Use `npm run dev:web` for hot reload during widget development
- **Testing:** Use MCP Inspector for thorough tool testing
- **Debugging:** Check server logs for detailed error messages
- **Security:** Never commit secrets or API keys

---

**Ready to run in 5 minutes! 🚀**
