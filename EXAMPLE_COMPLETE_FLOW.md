# 🎬 Exemplo Completo - Fluxo de Criação de App

Este documento mostra um exemplo real de criação de app MCP usando o FastMCP Builder com todas as automações.

## 📋 Cenário

**App:** Clima Diário  
**Objetivo:** Fornecer informações meteorológicas via ChatGPT  
**Usuário:** Pessoas que querem saber o clima rapidamente

---

## 🚀 Execução Completa

### Passo 1: Iniciar Builder

```bash
$ ./create-fastmcp-app.sh
```

**Saída:**
```
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║        🚀 FastMCP App Builder                            ║
║        Criador Interativo de Apps MCP                    ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝

Vamos criar seu ChatGPT App seguindo guidelines FastMCP!

Princípios FastMCP:
  • 1 tool = 1 intention (clara e focada)
  • Schemas explícitos com Zod
  • Respostas enxutas e previsíveis
  • UX nativa do ChatGPT
```

---

### Passo 2: Definir Use Case (OpenAI Framework)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 PASSO 1: Defina a ideia do seu app

Responda às seguintes perguntas:

1. Qual problema seu app resolve? 
> Pessoas querem saber o clima de forma rápida sem abrir outros apps

2. Quem é o usuário-alvo? 
> Pessoas que usam ChatGPT regularmente e querem informações meteorológicas

3. Nome do seu app: 
> clima-diario

4. Descrição curta: 
> Fornece informações meteorológicas atuais e previsão do tempo

5. O app terá interface visual? [s/n]: 
> s

Tipos de interface disponíveis:
  1. Widget React (cards, listas, gráficos)
  2. Canvas (visualizações customizadas)
  3. Form (entrada de dados estruturados)
  4. Mista (combinação de tipos)

Tipo de interface [1-4]: 
> 1

Que componentes precisa? Exemplo tabela, gráfico, formulário: 
> cards com temperatura, ícone do tempo, gráfico de previsão semanal

📖 OpenAI UI Guidelines:
  ✓ Usar widgets nativos do ChatGPT quando possível
  ✓ Design responsivo e acessível
  ✓ Performance otimizada - menos de 100ms render
  ✓ Seguir patterns do ChatGPT

Criar agente especializado em UI Guidelines? [s/n]: 
> s
```

---

### Passo 3: Definir Tools (Capabilities)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 PASSO 2: Defina as tools (funcionalidades)

Recomendação FastMCP: 1-3 tools máximo
Cada tool = 1 ação clara que o usuário quer fazer

Quantas tools? [1-3]: 
> 3

Tool 1/3:
  Nome da tool: 
  > obter_clima_atual
  
  Descrição - o que faz?: 
  > Obtém temperatura, condições meteorológicas e umidade atual de uma cidade
  
  Parâmetros - separados por vírgula ou 'nenhum': 
  > cidade, pais

Tool 2/3:
  Nome da tool: 
  > obter_previsao_semanal
  
  Descrição - o que faz?: 
  > Obtém previsão do tempo para os próximos 7 dias
  
  Parâmetros - separados por vírgula ou 'nenhum': 
  > cidade, pais

Tool 3/3:
  Nome da tool: 
  > alertas_meteorologicos
  
  Descrição - o que faz?: 
  > Verifica se há alertas meteorológicos ativos para uma região
  
  Parâmetros - separados por vírgula ou 'nenhum': 
  > cidade, pais
```

---

### Passo 4: Sistema de Agentes

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 PASSO 3: Sistema de Agentes - opcional

Você precisa de:
  • Agentes especializados (orquestração)
  • Golden prompts (instruções para o modelo)
  • Validação automática

Usar sistema de agentes? [s/n]: 
> s

✓ UIGuidelinesAgent adicionado automaticamente

Quantos agentes adicionais? [0-3]: 
> 1

Agente 1/1:
  Nome do agente: 
  > WeatherDataValidator
  
  Função/especialidade: 
  > Valida dados meteorológicos recebidos de APIs externas e formata para exibição
```

---

### Passo 5: Resumo e Confirmação

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 RESUMO DO SEU APP

App: clima-diario
Problema: Pessoas querem saber o clima de forma rápida sem abrir outros apps
Usuário: Pessoas que usam ChatGPT regularmente e querem informações meteorológicas
Descrição: Fornece informações meteorológicas atuais e previsão do tempo

Interface: Sim
  Tipo: widget
  Componentes: cards com temperatura, ícone do tempo, gráfico de previsão semanal
  ✓ Com agente de UI Guidelines

Tools (3):
  1. obter_clima_atual - Obtém temperatura, condições meteorológicas e umidade atual de uma cidade
     Parâmetros: cidade, pais
  2. obter_previsao_semanal - Obtém previsão do tempo para os próximos 7 dias
     Parâmetros: cidade, pais
  3. alertas_meteorologicos - Verifica se há alertas meteorológicos ativos para uma região
     Parâmetros: cidade, pais

Agentes (2):
  1. UIGuidelinesAgent - Especialista em OpenAI UI Guidelines - garante design acessível, responsivo e seguindo patterns do ChatGPT
  2. WeatherDataValidator - Valida dados meteorológicos recebidos de APIs externas e formata para exibição

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Confirmar e gerar código? [s/n]: 
> s
```

---

### Passo 6: Geração de Código

```
🎨 Gerando código...

✓ Diretório criado: apps/clima-diario
✓ Estrutura de diretórios criada
✓ package.json gerado
✓ tsconfig.json copiado
✓ Servidor MCP gerado (server/src/index.ts)
✓ Schemas Zod gerados
✓ README.md gerado
```

---

### Passo 7: Automações Finais (🆕 Novo!)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 AUTOMAÇÃO FINAL

Criar repositório Git? [s/n]: 
> s

Fazer deploy automático? [s/n]: 
> s

Testar via API? [s/n]: 
> s
```

#### Automação 1: Repositório Git

```
📦 Criando repositório Git...
✓ Repositório Git criado

Criar repositório no GitHub? [s/n]: 
> s

🌐 Criando repositório no GitHub...
✓ Repositório criado: https://github.com/seu-user/clima-diario
```

**O que foi feito:**
- `git init -b main`
- `.gitignore` criado
- Commit inicial: "🎉 Initial commit - FastMCP App: clima-diario"
- Push para GitHub (via `gh` CLI)

#### Automação 2: Deploy Automático

```
🚀 Fazendo deploy automático...

1. Instalando dependências...
✓ Dependências instaladas

2. Building servidor...
✓ Build concluído

✓ Configuração gerada: mcp_config_local.json

📝 Para ativar no ChatGPT Desktop:
   cp mcp_config_local.json "$HOME/.config/OpenAI/ChatGPT/mcp_config.json"
   (e reinicie o ChatGPT Desktop)
```

**Arquivo gerado: `mcp_config_local.json`**
```json
{
  "mcpServers": {
    "clima-diario": {
      "command": "/usr/bin/node",
      "args": [
        "/workspaces/apps/clima-diario/server/dist/index.js"
      ],
      "env": {}
    }
  }
}
```

#### Automação 3: Testes via API

```
🧪 Criando scripts de teste API...

✓ Scripts de teste criados:
   tests/api-test.sh - Teste via stdio (JSON-RPC)
   tests/http-test.sh - Teste via HTTP

Executar teste agora? [s/n]: 
> s

🧪 Executando testes...
Server: /workspaces/apps/clima-diario/server/dist/index.js

📋 Test 1: List available tools
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "obter_clima_atual",
        "description": "Obtém temperatura, condições meteorológicas e umidade atual de uma cidade",
        "inputSchema": {
          "type": "object",
          "properties": {
            "cidade": {
              "type": "string",
              "description": "Nome da cidade"
            },
            "pais": {
              "type": "string",
              "description": "Código do país (ex: BR, US)"
            }
          },
          "required": ["cidade", "pais"]
        }
      },
      {
        "name": "obter_previsao_semanal",
        "description": "Obtém previsão do tempo para os próximos 7 dias",
        "inputSchema": { ... }
      },
      {
        "name": "alertas_meteorologicos",
        "description": "Verifica se há alertas meteorológicos ativos para uma região",
        "inputSchema": { ... }
      }
    ]
  }
}

🔧 Test 2: Call tool
# Tool: obter_clima_atual (params: cidade, pais)
# (Necessita implementação da lógica)

✅ Tests completed!
```

---

### Passo 8: Finalização

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ APP GERADO COM SUCESSO!

📁 Localização: apps/clima-diario

✓ Repositório Git criado
✓ Deploy configurado
   Config: apps/clima-diario/mcp_config_local.json
✓ Scripts de teste criados
   Stdio: apps/clima-diario/tests/api-test.sh
   HTTP: apps/clima-diario/tests/http-test.sh

📝 Próximos passos:

1. Entrar no diretório:
   cd apps/clima-diario

2. Implementar lógica das tools em:
   server/src/index.ts

4. Testar localmente:
   ./tests/api-test.sh

5. Deploy no ChatGPT Desktop:
   cp mcp_config_local.json "$HOME/.config/OpenAI/ChatGPT/mcp_config.json"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Dica: Veja o app de exemplo 'biblia-diaria' para referência

🎉 Seu app segue 100% as OpenAI Apps SDK Guidelines!
```

---

## 📂 Estrutura Gerada

```
apps/clima-diario/
├── .git/                          # 🆕 Repositório Git
├── .gitignore                     # 🆕 Configurado automaticamente
├── mcp_config_local.json          # 🆕 Config para ChatGPT Desktop
├── package.json
├── tsconfig.json
├── README.md
├── server/
│   ├── src/
│   │   └── index.ts              # Servidor MCP com 3 tools
│   └── dist/                     # 🆕 Build já feito
│       └── index.js
└── tests/                         # 🆕 Scripts de teste
    ├── api-test.sh               # 🆕 Teste stdio/JSON-RPC
    └── http-test.sh              # 🆕 Teste HTTP/SSE
```

---

## 🔧 Implementação da Lógica

Agora você só precisa implementar a lógica das tools em `server/src/index.ts`:

```typescript
// Exemplo: obter_clima_atual
case "obter_clima_atual": {
  const validated = ObterClimaAtualSchema.parse(args);
  
  // Chamar API de clima (ex: OpenWeatherMap)
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${validated.cidade},${validated.pais}&appid=YOUR_API_KEY&units=metric`
  );
  
  const data = await response.json();
  
  return {
    content: [{
      type: "text",
      text: `🌤️ **Clima em ${validated.cidade}, ${validated.pais}**\n\n` +
            `Temperatura: ${data.main.temp}°C\n` +
            `Condição: ${data.weather[0].description}\n` +
            `Umidade: ${data.main.humidity}%`
    }]
  };
}
```

---

## 🧪 Testando Localmente

```bash
cd apps/clima-diario

# Testar via stdio
./tests/api-test.sh

# Ou iniciar servidor e testar manualmente
npm start
```

---

## 🚀 Deploy no ChatGPT Desktop

```bash
# Copiar configuração
cp mcp_config_local.json ~/.config/OpenAI/ChatGPT/mcp_config.json

# Reiniciar ChatGPT Desktop
# (Cmd+Q no macOS, fechar e reabrir no Linux/Windows)
```

---

## 💬 Testando no ChatGPT

Abra o ChatGPT Desktop e pergunte:

```
Você: Qual o clima em São Paulo, Brasil?
```

O ChatGPT vai usar sua tool `obter_clima_atual` automaticamente! 🎉

---

## 📊 Validação de Compliance

```bash
cd apps/clima-diario
npm run validate:openai
```

**Resultado esperado:**
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

## 📈 Próximos Passos

1. **Implementar todas as tools** com APIs reais
2. **Adicionar testes unitários** para cada tool
3. **Criar widget React** para visualização de dados
4. **Publicar no GitHub** (já está pronto!)
5. **Compartilhar com comunidade**

---

## 🎯 Tempo Total

- **Geração interativa:** 2-3 minutos
- **Automações (Git + Deploy + Testes):** 2 minutos
- **Implementação da lógica:** 15-30 minutos
- **Testes e ajustes:** 10 minutos

**Total: ~30 minutos** do zero até app funcional! ⚡

---

## 🆚 Antes vs Depois

### Antes (Método Manual)

1. Criar estrutura de pastas manualmente
2. Configurar package.json
3. Instalar dependências
4. Criar servidor MCP do zero
5. Implementar schemas Zod
6. Configurar build
7. Criar README
8. Inicializar Git
9. Configurar deploy
10. Criar testes

**Tempo: ~2-3 horas** 😓

### Depois (FastMCP Builder)

1. Executar `./create-fastmcp-app.sh`
2. Responder 10 perguntas
3. Deixar as automações executarem

**Tempo: ~5 minutos** ⚡

**Economia: ~95% do tempo!** 🎉

---

**Criado com ❤️ seguindo OpenAI Apps SDK Guidelines**
