# 🎯 Guia Rápido FastMCP Builder

## O que você pode fazer?

### ✨ Criar Apps do Zero
```bash
./create-fastmcp-app.sh
```

Responda algumas perguntas e tenha um app MCP completo!

### 🚀 Usar o App de Exemplo
```bash
npm install
npm run build:server
./deploy-fastmcp.sh local
```

## 💡 Fluxo de Trabalho

```
1. Ideia → 2. Tools → 3. Código → 4. Deploy
   30s       30s        AUTO      30s
```

**Total: ~2 minutos do zero ao ChatGPT!**

## 📚 Exemplos Práticos

### Exemplo 1: App de Clima

```bash
./create-fastmcp-app.sh

# Perguntas:
Problema? → Consultar clima em tempo real
Usuário? → Pessoas planejando o dia
Nome? → clima-tempo
Descrição? → Consulta clima por cidade

Tools? → 2
  1. obter_clima_atual (cidade)
  2. obter_previsao_7dias (cidade)

Agentes? → n
Widget? → n
```

**Resultado:** App funcional em 30 segundos!

### Exemplo 2: App de Tarefas

```bash
./create-fastmcp-app.sh

# Perguntas:
Problema? → Organizar tarefas diárias
Usuário? → Profissionais ocupados
Nome? → tarefas-ia
Descrição? → Gerenciador inteligente de tarefas

Tools? → 3
  1. criar_tarefa (titulo, prioridade)
  2. listar_tarefas ()
  3. concluir_tarefa (id)

Agentes? → s
  1. Organizador - prioriza tarefas
  2. Lembrete - sugere horários

Widget? → s
```

**Resultado:** App completo com agentes e UI!

## 🎨 Princípios FastMCP

### 1 Tool = 1 Intention
❌ **Ruim:** `gerenciar_tudo`  
✅ **Bom:** `criar_tarefa`, `listar_tarefas`, `concluir_tarefa`

### Schemas Claros
```typescript
// ❌ Ruim
z.object({ data: z.any() })

// ✅ Bom
z.object({ 
  cidade: z.string().describe("Nome da cidade")
})
```

### Respostas Enxutas
```typescript
// ❌ Verboso
return { content: [{ type: "text", text: JSON.stringify(bigObject) }] }

// ✅ Direto
return { content: [{ type: "text", text: "🌤️ 25°C em São Paulo" }] }
```

## 🔧 Comandos Essenciais

```bash
# Criar app novo
./create-fastmcp-app.sh

# Deploy local (exemplo)
./deploy-fastmcp.sh local

# Testar servidor
npm run start:fastmcp

# Validar FastMCP
npm run validate

# Criar package
./deploy-fastmcp.sh package
```

## 📖 Estrutura Gerada

```
apps/seu-app/
├── server/src/index.ts     # ← Implemente aqui
├── package.json            # ← Pronto
├── tsconfig.json           # ← Configurado
├── README.md               # ← Documentado
└── app-config.json         # ← Metadados
```

## 🎯 Checklist de Sucesso

- [ ] Definir problema claro
- [ ] 1-3 tools focadas
- [ ] Nomes descritivos
- [ ] Parâmetros explícitos
- [ ] Build sem erros
- [ ] Testar localmente
- [ ] Deploy no ChatGPT

## 🆘 Precisa de Ajuda?

### Erro: "Cannot find module"
```bash
cd apps/seu-app
npm install
npm run build
```

### Erro: "Tool não aparece no ChatGPT"
1. Verifique caminho absoluto no mcp_config.json
2. Reinicie ChatGPT Desktop
3. Veja logs: `npm run start:fastmcp`

### Dúvidas sobre Tools
Veja o exemplo em: `server/src/index-fastmcp.ts`

## 🌟 Dicas Pro

1. **Comece simples:** 1 tool primeiro
2. **Teste cedo:** `npm run start:fastmcp`
3. **Itere rápido:** Adicione tools gradualmente
4. **Use exemplos:** `biblia-diaria` como referência
5. **Valide sempre:** `npm run validate`

## 📚 Documentação

- [FASTMCP_QUICKSTART.md](FASTMCP_QUICKSTART.md) - Tutorial completo
- [FASTMCP_DEPLOY.md](FASTMCP_DEPLOY.md) - Guia de deploy
- [OPENAI_GUIDELINES.md](OPENAI_GUIDELINES.md) - Compliance OpenAI
- [README.md](README.md) - Visão geral do projeto

---

**FastMCP Builder** - De ideia a app em minutos! 🚀
