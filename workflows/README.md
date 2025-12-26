# 🔄 Workflows - FastMCP Builder Automation

Esta pasta contém workflows de automação para criar aplicações MCP em diferentes plataformas, todos seguindo a mesma lógica do nosso builder interativo.

## 📋 Conteúdo

```
workflows/
├── antigravity/              # Google AntiGravity workflows
│   └── fastmcp-builder.yaml
├── cursor/                   # Cursor AI workflows
│   └── fastmcp-builder.json
├── claude-hooks/             # Claude Desktop hooks
│   └── fastmcp_builder_hook.py
└── README.md                 # Este arquivo
```

## 🎯 Objetivo

Todos os workflows seguem **exatamente** o mesmo framework do script bash `create-fastmcp-app.sh`:

### Framework OpenAI Apps SDK

1. **PASSO 1: Define Use Case**
   - Qual problema resolve?
   - Quem é o usuário?
   - Nome e descrição
   - **🆕 Interface visual?** (UI Guidelines)

2. **PASSO 2: Identify Capabilities**
   - Quantas tools? (1-3 máximo)
   - Nome, descrição e parâmetros de cada tool

3. **PASSO 3: Orchestration**
   - Sistema de agentes?
   - **🆕 UIGuidelinesAgent** (auto-incluído se tem interface)
   - Agentes adicionais

---

## 🚀 Google AntiGravity

### Arquivo
`antigravity/fastmcp-builder.yaml`

### O que é AntiGravity?
Google AntiGravity é uma plataforma de automação visual que permite criar workflows complexos usando YAML ou interface gráfica.

### Setup

1. **Instalar AntiGravity CLI**
   ```bash
   npm install -g @google/antigravity-cli
   ```

2. **Login**
   ```bash
   antigravity login
   ```

3. **Deploy do Workflow**
   ```bash
   cd workflows/antigravity
   antigravity deploy fastmcp-builder.yaml
   ```

### Como Usar

**Método 1: Via CLI**
```bash
antigravity run fastmcp-builder
```

**Método 2: Via Interface Web**
1. Acesse: https://antigravity.google.com
2. Vá em "Workflows" → "Import"
3. Faça upload de `fastmcp-builder.yaml`
4. Clique em "Run"

### Funcionalidades

- ✅ Prompts interativos para cada passo
- ✅ Validação de input (regex patterns)
- ✅ Loops para múltiplas tools/agentes
- ✅ Geração automática de código
- ✅ Build e validação de compliance
- ✅ Deploy automático

### Triggers

O workflow pode ser acionado por:
- Comando: `criar app mcp`
- Comando: `novo app chatgpt`
- Comando: `fastmcp app`
- Evento customizado

### Exemplo de Uso

```bash
$ antigravity run fastmcp-builder

📝 PASSO 1: Use Case
Qual problema seu app resolve? 
> Ajudar usuários a encontrar versículos bíblicos

Quem é o usuário-alvo?
> Cristãos que buscam inspiração diária

Nome do app:
> biblia-diaria

...
```

---

## 💻 Cursor AI

### Arquivo
`cursor/fastmcp-builder.json`

### O que é Cursor?
Cursor é um editor de código AI-powered que permite criar workflows customizados em JSON.

### Setup

1. **Abrir Cursor**
   - Download: https://cursor.sh

2. **Instalar Workflow**
   ```bash
   # Copiar para diretório de workflows do Cursor
   cp workflows/cursor/fastmcp-builder.json ~/.cursor/workflows/
   ```

3. **Recarregar Cursor**
   - Cmd/Ctrl + Shift + P
   - "Reload Window"

### Como Usar

**Método 1: Command Palette**
1. Cmd/Ctrl + Shift + P
2. Digite: "criar app mcp"
3. Pressione Enter

**Método 2: Keyboard Shortcut**
1. Configure um atalho em Settings → Keyboard Shortcuts
2. Procure por "FastMCP App Builder"
3. Adicione atalho (ex: Cmd+K Cmd+M)

### Funcionalidades

- ✅ Integração nativa com editor
- ✅ Auto-complete nos prompts
- ✅ Geração de código inline
- ✅ Preview antes de salvar
- ✅ Git integration automática

### Estrutura do JSON

```json
{
  "name": "FastMCP App Builder",
  "triggers": { "commands": ["criar app mcp"] },
  "steps": [
    {
      "id": "step1_use_case",
      "type": "section",
      "questions": [...]
    },
    ...
  ]
}
```

### Exemplo de Uso

```
> criar app mcp

[Cursor abre painel lateral]

📝 PASSO 1: Use Case
Qual problema seu app resolve?
[Input field com auto-complete]

[Após preencher todos os campos]
✅ App criado em: apps/meu-app/
```

---

## 🤖 Claude Desktop Hooks

### Arquivo
`claude-hooks/fastmcp_builder_hook.py`

### O que são Claude Hooks?
Hooks Python que podem ser registrados como servidores MCP no Claude Desktop, permitindo automação via Model Context Protocol.

### Setup

1. **Instalar Python 3.10+**
   ```bash
   python --version  # Deve ser >= 3.10
   ```

2. **Instalar Dependências**
   ```bash
   pip install anthropic-sdk
   ```

3. **Registrar no Claude Desktop**
   
   Edite o arquivo de configuração:
   
   **macOS:**
   ```bash
   nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```
   
   **Linux:**
   ```bash
   nano ~/.config/Claude/claude_desktop_config.json
   ```
   
   **Windows:**
   ```bash
   notepad %APPDATA%\Claude\claude_desktop_config.json
   ```
   
   Adicione:
   ```json
   {
     "mcpServers": {
       "fastmcp-builder": {
         "command": "python",
         "args": [
           "/caminho/completo/para/workflows/claude-hooks/fastmcp_builder_hook.py"
         ],
         "env": {}
       }
     }
   }
   ```

4. **Reiniciar Claude Desktop**

### Como Usar

**No Claude Desktop:**

```
Você: criar um app mcp

Claude: [Executa hook e inicia wizard interativo]
📝 PASSO 1: Defina a ideia do seu app
1. Qual problema seu app resolve? 
```

### Funcionalidades

- ✅ Integração direta com Claude
- ✅ Conversacional (via prompts Python)
- ✅ Geração de código completa
- ✅ Build e validação automáticos
- ✅ Pode ser chamado de qualquer conversa

### Estrutura do Hook

```python
class FastMCPBuilderHook:
    def gather_use_case(self) -> Dict:
        """PASSO 1: Use Case"""
        ...
    
    def gather_tools(self) -> List[Dict]:
        """PASSO 2: Tools"""
        ...
    
    def gather_agents(self) -> tuple:
        """PASSO 3: Agentes"""
        ...
    
    def run(self):
        """Executa workflow completo"""
        ...
```

### Exemplo de Uso

```python
# Executar diretamente (para teste)
python workflows/claude-hooks/fastmcp_builder_hook.py

# Ou via Claude Desktop
# (automaticamente invocado ao mencionar "criar app mcp")
```

---

## 📊 Comparação de Workflows

| Aspecto | AntiGravity | Cursor | Claude Hooks |
|---------|-------------|--------|--------------|
| **Formato** | YAML | JSON | Python |
| **Integração** | Web/CLI | Editor | Claude Desktop |
| **Interface** | Visual + CLI | IDE nativa | Conversacional |
| **Complexidade** | Alta | Média | Baixa |
| **Customização** | Alta | Média | Alta |
| **Setup** | CLI install | File copy | Config edit |
| **Ideal para** | CI/CD, Teams | Dev individual | Chat-driven dev |

---

## 🎯 Quando Usar Cada Um?

### Use AntiGravity quando:
- ✅ Precisa de automação em escala (CI/CD)
- ✅ Trabalha em equipe (workflows compartilhados)
- ✅ Quer interface visual para não-devs
- ✅ Precisa de triggers complexos (eventos, schedules)

### Use Cursor quando:
- ✅ Desenvolvimento individual
- ✅ Quer integração com editor
- ✅ Prefere keyboard-driven workflow
- ✅ Usa Cursor como IDE principal

### Use Claude Hooks quando:
- ✅ Usa Claude Desktop regularmente
- ✅ Prefere interação conversacional
- ✅ Quer prototipar rapidamente
- ✅ Trabalha iterativamente com AI

---

## 🔧 Customização

Todos os workflows podem ser customizados editando:

### 1. Perguntas (Questions)
```yaml
# AntiGravity
prompts:
  - id: "custom_question"
    question: "Sua pergunta aqui?"
    required: true
```

```json
// Cursor
"questions": [
  {
    "id": "custom_question",
    "prompt": "Sua pergunta aqui?",
    "type": "text"
  }
]
```

```python
# Claude Hooks
custom_answer = input("Sua pergunta aqui? ")
```

### 2. Validações
```yaml
# AntiGravity
validation:
  pattern: "^[a-z-]+$"
  message: "Use apenas letras e hífens"
```

```json
// Cursor
"validation": {
  "pattern": "^[a-z-]+$",
  "message": "Use apenas letras e hífens"
}
```

```python
# Claude Hooks
import re
if not re.match(r'^[a-z-]+$', answer):
    print("Use apenas letras e hífens")
```

### 3. Templates
Todos os workflows usam os mesmos templates em `../../templates/`:
- `openai-compliant-server.ts`
- `openai-compliant-readme.md`
- `tsconfig.json`

Para customizar, edite esses arquivos.

---

## 📚 Referências

### OpenAI Apps SDK
- [Planning Framework](https://developers.openai.com/apps-sdk/plan/use-case)
- [MCP Server Build](https://developers.openai.com/apps-sdk/build/mcp-server)
- [UI Guidelines](https://developers.openai.com/apps-sdk/concepts/ui-guidelines)
- [Deploy Guide](https://developers.openai.com/apps-sdk/deploy)

### Ferramentas
- [Google AntiGravity](https://antigravity.google.com)
- [Cursor Editor](https://cursor.sh)
- [Claude Desktop](https://claude.ai/desktop)

### Documentação do Projeto
- [COMPLETE_GUIDE.md](../COMPLETE_GUIDE.md) - Guia completo do sistema
- [OPENAI_GUIDELINES.md](../OPENAI_GUIDELINES.md) - Compliance detalhado
- [FASTMCP_QUICKSTART.md](../FASTMCP_QUICKSTART.md) - Início rápido FastMCP
- [FASTMCP_DEPLOY.md](../FASTMCP_DEPLOY.md) - Guia de deploy

---

## 🤝 Contribuindo

Para adicionar novos workflows:

1. Crie pasta: `workflows/plataforma-nome/`
2. Adicione arquivo de workflow
3. Documente na seção correspondente deste README
4. Teste end-to-end
5. Abra PR

### Checklist para Novos Workflows

- [ ] Segue os 3 passos do framework OpenAI
- [ ] Inclui pergunta sobre interface visual
- [ ] Auto-inclui UIGuidelinesAgent quando necessário
- [ ] Gera código usando templates compartilhados
- [ ] Executa validação de compliance
- [ ] Tem exemplo de uso documentado
- [ ] Funciona com Node 18+

---

## 🐛 Troubleshooting

### AntiGravity

**Erro: "Workflow not found"**
```bash
# Verificar se está logado
antigravity whoami

# Re-deploy
antigravity deploy fastmcp-builder.yaml
```

**Erro: "Invalid YAML syntax"**
```bash
# Validar YAML
yamllint fastmcp-builder.yaml
```

### Cursor

**Workflow não aparece**
```bash
# Verificar localização
ls ~/.cursor/workflows/

# Recarregar Cursor
Cmd+Shift+P → "Reload Window"
```

**Erro de JSON**
```bash
# Validar JSON
jq . fastmcp-builder.json
```

### Claude Hooks

**Hook não é reconhecido**
```bash
# Verificar caminho no config
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Testar hook diretamente
python fastmcp_builder_hook.py
```

**Erro de permissão**
```bash
# Dar permissão de execução
chmod +x fastmcp_builder_hook.py
```

---

## 📝 Licença

MIT - Mesma licença do projeto principal

---

## 📧 Suporte

Para questões sobre workflows específicos:
- **AntiGravity**: Ver docs oficiais do Google
- **Cursor**: Ver docs do Cursor.sh
- **Claude Hooks**: Ver MCP SDK documentation

Para questões sobre o builder FastMCP:
- Ver [COMPLETE_GUIDE.md](../COMPLETE_GUIDE.md)
- Abrir issue no repositório

---

**Criado com ❤️ seguindo OpenAI Apps SDK Guidelines**
