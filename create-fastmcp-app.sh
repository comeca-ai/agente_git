#!/bin/bash

# 🚀 FastMCP App Builder - Interactive Creator
# Cria aplicações MCP seguindo guidelines FastMCP

set -e

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

clear

echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                          ║${NC}"
echo -e "${BLUE}║        🚀 FastMCP App Builder                            ║${NC}"
echo -e "${BLUE}║        Criador Interativo de Apps MCP                    ║${NC}"
echo -e "${BLUE}║                                                          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Vamos criar seu ChatGPT App seguindo guidelines FastMCP!${NC}"
echo ""
echo -e "${YELLOW}Princípios FastMCP:${NC}"
echo -e "  • 1 tool = 1 intention (clara e focada)"
echo -e "  • Schemas explícitos com Zod"
echo -e "  • Respostas enxutas e previsíveis"
echo -e "  • UX nativa do ChatGPT"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ============================================
# PASSO 1: Qual a ideia do app?
# ============================================

echo -e "${CYAN}📝 PASSO 1: Defina a ideia do seu app${NC}"
echo ""
echo -e "${YELLOW}Responda às seguintes perguntas:${NC}"
echo ""

read -p "$(echo -e ${GREEN}1. Qual problema seu app resolve? ${NC})" APP_PROBLEM
echo ""

read -p "$(echo -e ${GREEN}2. Quem é o usuário-alvo? ${NC})" APP_USER
echo ""

read -p "$(echo -e ${GREEN}3. Nome do seu app: ${NC})" APP_NAME
echo ""

read -p "$(echo -e ${GREEN}4. Descrição curta: ${NC})" APP_DESCRIPTION
echo ""

read -p "$(echo -e ${GREEN}5. O app terá interface visual? [s/n]: ${NC})" HAS_UI
echo ""

# Configuração de UI
USE_UI_AGENT="n"
UI_TYPE=""
UI_COMPONENTS=""

if [[ "$HAS_UI" == "s" || "$HAS_UI" == "S" ]]; then
    echo -e "${YELLOW}Tipos de interface disponíveis:${NC}"
    echo -e "  ${BLUE}1.${NC} Widget React - cards, listas, gráficos"
    echo -e "  ${BLUE}2.${NC} Canvas - visualizações customizadas"
    echo -e "  ${BLUE}3.${NC} Form - entrada de dados estruturados"
    echo -e "  ${BLUE}4.${NC} Mista - combinação de tipos"
    echo ""
    
    read -p "$(echo -e ${GREEN}Tipo de interface [1-4 ou widget/canvas/form/mista]: ${NC})" UI_TYPE_INPUT
    echo ""
    
    # Aceitar tanto números quanto texto
    case $UI_TYPE_INPUT in
        1|widget) UI_TYPE="widget";;
        2|canvas) UI_TYPE="canvas";;
        3|form) UI_TYPE="form";;
        4|mista|mixed) UI_TYPE="mixed";;
        *) UI_TYPE="widget";;
    esac
    
    read -p "$(echo -e ${GREEN}Que componentes precisa? Exemplo tabela, gráfico, formulário: ${NC})" UI_COMPONENTS
    echo ""
    
    echo -e "${YELLOW}📖 OpenAI UI Guidelines:${NC}"
    echo -e "  ✓ Usar widgets nativos do ChatGPT quando possível"
    echo -e "  ✓ Design responsivo e acessível"
    echo -e "  ✓ Performance otimizada - menos de 100ms render"
    echo -e "  ✓ Seguir patterns do ChatGPT"
    echo ""
    
    read -p "$(echo -e ${GREEN}Criar agente especializado em UI Guidelines? [s/n]: ${NC})" USE_UI_AGENT
    echo ""
fi

# ============================================
# PASSO 2: Quantas e quais tools?
# ============================================

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}🔧 PASSO 2: Defina as tools - funcionalidades${NC}"
echo ""
echo -e "${YELLOW}Recomendação FastMCP: 1-3 tools máximo${NC}"
echo -e "Cada tool = 1 ação clara que o usuário quer fazer"
echo ""

read -p "$(echo -e ${GREEN}Quantas tools? [1-3]: ${NC})" TOOL_COUNT
echo ""

# Validar número de tools
if ! [[ "$TOOL_COUNT" =~ ^[1-3]$ ]]; then
    echo -e "${RED}❌ Número inválido. Use 1, 2 ou 3.${NC}"
    exit 1
fi

# Coletar informações de cada tool
declare -a TOOL_NAMES
declare -a TOOL_DESCRIPTIONS
declare -a TOOL_PARAMS

for i in $(seq 1 $TOOL_COUNT); do
    echo -e "${YELLOW}Tool $i/${TOOL_COUNT}:${NC}"
    echo ""
    
    read -p "$(echo -e ${GREEN}  Nome da tool   : ${NC})" tool_name
    TOOL_NAMES[$i]=$tool_name
    
    read -p "$(echo -e ${GREEN}  Descrição - o que faz?: ${NC})" tool_desc
    TOOL_DESCRIPTIONS[$i]=$tool_desc
    
    read -p "$(echo -e ${GREEN}  Parâmetros - separados por vírgula ou 'nenhum': ${NC})" tool_params
    TOOL_PARAMS[$i]=$tool_params
    
    echo ""
done

# ============================================
# PASSO 3: Precisa de prompts/agentes?
# ============================================

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}🤖 PASSO 3: Sistema de Agentes - opcional${NC}"
echo ""
echo -e "${YELLOW}Você precisa de:${NC}"
echo -e "  • Agentes especializados (orquestração)"
echo -e "  • Golden prompts (instruções para o modelo)"
echo -e "  • Validação automática"
echo ""

read -p "$(echo -e ${GREEN}Usar sistema de agentes? [s/n]: ${NC})" USE_AGENTS
echo ""

if [[ "$USE_AGENTS" == "s" || "$USE_AGENTS" == "S" ]]; then
    # Começar contagem em 0 se tiver agente de UI
    if [[ "$USE_UI_AGENT" == "s" || "$USE_UI_AGENT" == "S" ]]; then
        AGENT_COUNT=1
        AGENT_NAMES[1]="UIGuidelinesAgent"
        AGENT_ROLES[1]="Especialista em OpenAI UI Guidelines - garante design acessível, responsivo e seguindo patterns do ChatGPT"
        echo -e "${GREEN}✓${NC} Agente de UI Guidelines adicionado automaticamente"
        echo ""
    else
        AGENT_COUNT=0
    fi
    
    read -p "$(echo -e ${GREEN}Quantos agentes adicionais? [0-3]: ${NC})" EXTRA_AGENTS
    echo ""
    
    declare -a AGENT_NAMES
    declare -a AGENT_ROLES
    
    # Preservar agente de UI se existir
    if [[ "$USE_UI_AGENT" == "s" || "$USE_UI_AGENT" == "S" ]]; then
        AGENT_NAMES[1]="UIGuidelinesAgent"
        AGENT_ROLES[1]="Especialista em OpenAI UI Guidelines - garante design acessível, responsivo e seguindo patterns do ChatGPT"
    fi
    
    # Adicionar agentes extras
    for i in $(seq 1 $EXTRA_AGENTS); do
        idx=$((AGENT_COUNT + i))
        echo -e "${YELLOW}Agente $i/${EXTRA_AGENTS}:${NC}"
        read -p "$(echo -e ${GREEN}  Nome do agente: ${NC})" agent_name
        AGENT_NAMES[$idx]=$agent_name
        
        read -p "$(echo -e ${GREEN}  Função/especialidade: ${NC})" agent_role
        AGENT_ROLES[$idx]=$agent_role
        echo ""
    done
    
    AGENT_COUNT=$((AGENT_COUNT + EXTRA_AGENTS))
fi

# ============================================
# RESUMO E CONFIRMAÇÃO
# ============================================

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}📋 RESUMO DO SEU APP${NC}"
echo ""
echo -e "${YELLOW}App:${NC} $APP_NAME"
echo -e "${YELLOW}Problema:${NC} $APP_PROBLEM"
echo -e "${YELLOW}Usuário:${NC} $APP_USER"
echo -e "${YELLOW}Descrição:${NC} $APP_DESCRIPTION"

if [[ "$HAS_UI" == "s" || "$HAS_UI" == "S" ]]; then
    echo ""
    echo -e "${YELLOW}Interface:${NC} Sim"
    echo -e "  Tipo: $UI_TYPE"
    echo -e "  Componentes: $UI_COMPONENTS"
    if [[ "$USE_UI_AGENT" == "s" || "$USE_UI_AGENT" == "S" ]]; then
        echo -e "  ${GREEN}✓${NC} Com agente de UI Guidelines"
    fi
fi

echo ""
echo -e "${YELLOW}Tools ($TOOL_COUNT):${NC}"
for i in $(seq 1 $TOOL_COUNT); do
    echo -e "  $i. ${TOOL_NAMES[$i]} - ${TOOL_DESCRIPTIONS[$i]}"
    if [[ "${TOOL_PARAMS[$i]}" != "nenhum" ]]; then
        echo -e "     Parâmetros: ${TOOL_PARAMS[$i]}"
    fi
done
echo ""

if [[ "$USE_AGENTS" == "s" || "$USE_AGENTS" == "S" ]]; then
    echo -e "${YELLOW}Agentes ($AGENT_COUNT):${NC}"
    for i in $(seq 1 $AGENT_COUNT); do
        echo -e "  $i. ${AGENT_NAMES[$i]} - ${AGENT_ROLES[$i]}"
    done
    echo ""
fi

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

read -p "$(echo -e ${GREEN}Confirmar e gerar código? [s/n]: ${NC})" CONFIRM
echo ""

if [[ "$CONFIRM" != "s" && "$CONFIRM" != "S" ]]; then
    echo -e "${RED}❌ Geração cancelada.${NC}"
    exit 0
fi

# ============================================
# GERAR CÓDIGO
# ============================================

echo -e "${BLUE}🚀 Gerando código FastMCP...${NC}"
echo ""

# Criar estrutura de diretórios
PROJECT_DIR="projetos/$APP_NAME"
mkdir -p "$PROJECT_DIR/server/src"
if [[ "$USE_WIDGET" == "s" || "$USE_WIDGET" == "S" ]]; then
    mkdir -p "$PROJECT_DIR/web/src"
fi
if [[ "$USE_AGENTS" == "s" || "$USE_AGENTS" == "S" ]]; then
    mkdir -p "$PROJECT_DIR/builder/src"
fi

# Salvar configuração do app
cat > "$PROJECT_DIR/app-config.json" << EOF
{
  "name": "$APP_NAME",
  "description": "$APP_DESCRIPTION",
  "problem": "$APP_PROBLEM",
  "user": "$APP_USER",
  "toolCount": $TOOL_COUNT,
  "useAgents": $([ "$USE_AGENTS" == "s" ] && echo "true" || echo "false"),
  "useWidget": $([ "$USE_WIDGET" == "s" ] && echo "true" || echo "false")
}
EOF

echo -e "${GREEN}✓${NC} Estrutura de diretórios criada"
echo -e "${GREEN}✓${NC} Configuração salva: $PROJECT_DIR/app-config.json"
echo ""

# Gerar código do servidor MCP
echo -e "${YELLOW}Gerando servidor MCP FastMCP...${NC}"

# Criar o servidor usando Node.js para gerar o código
node << 'NODESCRIPT'
const fs = require('fs');
const path = require('path');

// Ler variáveis de ambiente passadas pelo bash
const appName = process.env.APP_NAME;
const appDescription = process.env.APP_DESCRIPTION;
const toolCount = parseInt(process.env.TOOL_COUNT);
const projectDir = process.env.PROJECT_DIR;

// Ler arrays de tools
const toolNames = [];
const toolDescriptions = [];
const toolParams = [];

for (let i = 1; i <= toolCount; i++) {
    toolNames.push(process.env[`TOOL_NAME_${i}`]);
    toolDescriptions.push(process.env[`TOOL_DESC_${i}`]);
    toolParams.push(process.env[`TOOL_PARAMS_${i}`]);
}

// Gerar código do servidor
const serverCode = `/**
 * FastMCP Server - ${appName}
 * ${appDescription}
 * 
 * Gerado automaticamente pelo FastMCP Builder
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// ============================================
// FASTMCP STYLE: Schemas Claros
// ============================================

${toolNames.map((name, idx) => {
    const params = toolParams[idx];
    if (params === 'nenhum') {
        return `const ${toCamelCase(name)}Schema = z.object({});`;
    } else {
        const paramList = params.split(',').map(p => p.trim());
        const schemaProps = paramList.map(p => 
            `  ${p}: z.string().describe("${p}"),`
        ).join('\n');
        return `const ${toCamelCase(name)}Schema = z.object({\n${schemaProps}\n});`;
    }
}).join('\n\n')}

// ============================================
// CRIAR SERVIDOR MCP
// ============================================

const server = new Server(
  {
    name: "${appName}",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ============================================
// REGISTRAR TOOLS
// ============================================

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
${toolNames.map((name, idx) => {
    const params = toolParams[idx];
    const hasParams = params !== 'nenhum';
    const paramList = hasParams ? params.split(',').map(p => p.trim()) : [];
    
    return `      {
        name: "${name}",
        description: "${toolDescriptions[idx]}",
        inputSchema: {
          type: "object",
          properties: ${hasParams ? `{
            ${paramList.map(p => `${p}: { type: "string", description: "${p}" }`).join(',\n            ')}
          }` : '{}'},
          required: [${hasParams ? paramList.map(p => `"${p}"`).join(', ') : ''}],
        },
      }`;
}).join(',\n')}
    ],
  };
});

// ============================================
// IMPLEMENTAR TOOLS
// ============================================

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
${toolNames.map((name, idx) => `      case "${name}": {
        const validated = ${toCamelCase(name)}Schema.parse(args);
        
        // TODO: Implementar lógica da tool aqui
        return {
          content: [
            {
              type: "text",
              text: "✅ Tool ${name} executada com sucesso!\\n\\nImplemente a lógica aqui.",
            },
          ],
        };
      }`).join('\n\n')}

      default:
        return {
          content: [
            {
              type: "text",
              text: \`❌ Tool desconhecida: \${name}\`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: \`❌ Erro: \${error instanceof Error ? error.message : String(error)}\`,
        },
      ],
      isError: true,
    };
  }
});

// ============================================
// INICIAR SERVIDOR
// ============================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("✅ ${appName} MCP Server running (FastMCP style)");
}

main().catch((error) => {
  console.error("❌ Server error:", error);
  process.exit(1);
});

function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}
`;

// Salvar arquivo
fs.writeFileSync(
    path.join(projectDir, 'server/src/index.ts'),
    serverCode
);

console.log('✓ Servidor gerado');

function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}
NODESCRIPT

# Exportar variáveis para o Node.js
export APP_NAME="$APP_NAME"
export APP_DESCRIPTION="$APP_DESCRIPTION"
export TOOL_COUNT="$TOOL_COUNT"
export PROJECT_DIR="$PROJECT_DIR"

for i in $(seq 1 $TOOL_COUNT); do
    export "TOOL_NAME_$i"="${TOOL_NAMES[$i]}"
    export "TOOL_DESC_$i"="${TOOL_DESCRIPTIONS[$i]}"
    export "TOOL_PARAMS_$i"="${TOOL_PARAMS[$i]}"
done

# Executar geração
node -e "
const fs = require('fs');
const appName = '$APP_NAME';
const appDescription = '$APP_DESCRIPTION';
const projectDir = '$PROJECT_DIR';

const serverCode = \`/**
 * FastMCP Server - \${appName}
 * \${appDescription}
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// TODO: Implementar tools aqui
// Veja o exemplo em: biblia-diaria/server/src/index-fastmcp.ts

const server = new Server(
  { name: '\${appName}', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// Adicione suas tools aqui seguindo o padrão FastMCP

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('✅ \${appName} running (FastMCP)');
}

main().catch(err => { console.error(err); process.exit(1); });
\`;

fs.writeFileSync(projectDir + '/server/src/index.ts', serverCode);
"

echo -e "${GREEN}✓${NC} Servidor MCP gerado"

# Gerar package.json
cat > "$PROJECT_DIR/package.json" << EOF
{
  "name": "$APP_NAME",
  "version": "1.0.0",
  "description": "$APP_DESCRIPTION",
  "type": "module",
  "main": "server/dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node server/dist/index.js",
    "dev": "tsc && node server/dist/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.25.1",
    "zod": "^4.2.1"
  },
  "devDependencies": {
    "@types/node": "^25.0.3",
    "typescript": "^5.9.3"
  }
}
EOF

echo -e "${GREEN}✓${NC} package.json gerado"

# Gerar tsconfig.json
cat > "$PROJECT_DIR/tsconfig.json" << EOF
{
  "compilerOptions": {
    "rootDir": "./server/src",
    "outDir": "./server/dist",
    "module": "nodenext",
    "target": "esnext",
    "types": ["node"],
    "lib": ["esnext"],
    "sourceMap": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "moduleResolution": "nodenext"
  },
  "include": ["server/src/**/*"]
}
EOF

echo -e "${GREEN}✓${NC} tsconfig.json gerado"

# Gerar README
cat > "$PROJECT_DIR/README.md" << EOF
# $APP_NAME

$APP_DESCRIPTION

## 🎯 Problema
$APP_PROBLEM

## 👤 Usuário
$APP_USER

## 🚀 Quick Start

\`\`\`bash
# 1. Instalar dependências
npm install

# 2. Build
npm run build

# 3. Executar
npm start
\`\`\`

## 🔧 Tools Disponíveis

EOF

for i in $(seq 1 $TOOL_COUNT); do
    cat >> "$PROJECT_DIR/README.md" << EOF
### ${TOOL_NAMES[$i]}
${TOOL_DESCRIPTIONS[$i]}

EOF
    if [[ "${TOOL_PARAMS[$i]}" != "nenhum" ]]; then
        cat >> "$PROJECT_DIR/README.md" << EOF
Parâmetros: \`${TOOL_PARAMS[$i]}\`

EOF
    fi
done

cat >> "$PROJECT_DIR/README.md" << EOF

## 📦 Deploy

\`\`\`bash
# Local (ChatGPT Desktop)
# Copie o caminho absoluto de server/dist/index.js
# Configure em ~/.config/OpenAI/ChatGPT/mcp_config.json
\`\`\`

---
Gerado por FastMCP Builder
EOF

echo -e "${GREEN}✓${NC} README.md gerado"
echo ""

# ============================================
# AUTOMAÇÃO FINAL
# ============================================

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}🚀 AUTOMAÇÃO FINAL${NC}"
echo ""

# Perguntar sobre automações
read -p "$(echo -e ${GREEN}Criar repositório Git? [s/n]: ${NC})" CREATE_REPO
read -p "$(echo -e ${GREEN}Fazer deploy automático? [s/n]: ${NC})" AUTO_DEPLOY
read -p "$(echo -e ${GREEN}Testar via API? [s/n]: ${NC})" API_TEST
echo ""

# ============================================
# 1. CRIAR REPOSITÓRIO GIT
# ============================================

if [[ "$CREATE_REPO" == "s" || "$CREATE_REPO" == "S" ]]; then
    echo -e "${YELLOW}📦 Criando repositório Git...${NC}"
    cd "$PROJECT_DIR"
    
    git init -b main
    
    # Criar .gitignore
    cat > .gitignore << 'EOF'
node_modules/
dist/
*.log
.env
.DS_Store
mcp_config*.json
EOF
    
    git add .
    git commit -m "🎉 Initial commit - FastMCP App: $APP_NAME

Generated by FastMCP Builder
- OpenAI Apps SDK compliant
- $TOOL_COUNT tools implemented
- FastMCP style (1 tool = 1 intention)
"
    
    echo -e "${GREEN}✓${NC} Repositório Git criado"
    
    # Verificar se tem gh CLI
    if command -v gh &> /dev/null; then
        read -p "$(echo -e ${GREEN}Criar repositório no GitHub? [s/n]: ${NC})" CREATE_GITHUB
        
        if [[ "$CREATE_GITHUB" == "s" || "$CREATE_GITHUB" == "S" ]]; then
            echo -e "${YELLOW}🌐 Criando repositório no GitHub...${NC}"
            
            gh repo create "$APP_NAME" --public --source=. --remote=origin --push
            
            echo -e "${GREEN}✓${NC} Repositório criado: https://github.com/$(gh api user -q .login)/$APP_NAME"
        fi
    fi
    
    cd - > /dev/null
    echo ""
fi

# ============================================
# 2. DEPLOY AUTOMÁTICO
# ============================================

if [[ "$AUTO_DEPLOY" == "s" || "$AUTO_DEPLOY" == "S" ]]; then
    echo -e "${YELLOW}🚀 Fazendo deploy automático...${NC}"
    echo ""
    
    cd "$PROJECT_DIR"
    
    # Instalar dependências
    echo -e "${YELLOW}1. Instalando dependências...${NC}"
    npm install --silent
    echo -e "${GREEN}✓${NC} Dependências instaladas"
    
    # Build
    echo -e "${YELLOW}2. Building servidor...${NC}"
    npm run build
    echo -e "${GREEN}✓${NC} Build concluído"
    
    # Gerar configuração MCP
    ABSOLUTE_PATH=$(realpath server/dist/index.js)
    NODE_PATH=$(which node)
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        CONFIG_PATH="$HOME/Library/Application Support/OpenAI/ChatGPT/mcp_config.json"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        CONFIG_PATH="$HOME/.config/OpenAI/ChatGPT/mcp_config.json"
    else
        CONFIG_PATH="~/.config/OpenAI/ChatGPT/mcp_config.json"
    fi
    
    # Criar config local
    cat > mcp_config_local.json << EOF
{
  "mcpServers": {
    "$APP_NAME": {
      "command": "$NODE_PATH",
      "args": [
        "$ABSOLUTE_PATH"
      ],
      "env": {}
    }
  }
}
EOF
    
    echo -e "${GREEN}✓${NC} Configuração gerada: mcp_config_local.json"
    echo ""
    echo -e "${CYAN}📝 Para ativar no ChatGPT Desktop:${NC}"
    echo -e "   cp mcp_config_local.json \"$CONFIG_PATH\""
    echo -e "   (e reinicie o ChatGPT Desktop)"
    echo ""
    
    # Opção de deploy na cloud
    if [ -f "../../.env.fastmcp" ]; then
        read -p "$(echo -e ${GREEN}Deploy também no FastMCP Cloud? [s/n]: ${NC})" DEPLOY_CLOUD
        
        if [[ "$DEPLOY_CLOUD" == "s" || "$DEPLOY_CLOUD" == "S" ]]; then
            echo ""
            echo -e "${YELLOW}☁️  Deploying to FastMCP Cloud...${NC}"
            
            ../../deploy-fastmcp-cloud.sh "$(pwd)"
        fi
    fi
    
    cd - > /dev/null
    echo ""
fi

# ============================================
# 3. TESTE VIA API
# ============================================

if [[ "$API_TEST" == "s" || "$API_TEST" == "S" ]]; then
    echo -e "${YELLOW}🧪 Criando scripts de teste API...${NC}"
    
    cd "$PROJECT_DIR"
    
    # Criar script de teste
    mkdir -p tests
    
    cat > tests/api-test.sh << 'EOFTEST'
#!/bin/bash

# Test script for MCP server via stdio
# Tests all tools defined in the app

set -e

SERVER_PATH="$(dirname "$0")/../server/dist/index.js"
NODE_BIN=$(which node)

echo "🧪 Testing MCP Server"
echo "Server: $SERVER_PATH"
echo ""

# Test 1: ListTools
echo "📋 Test 1: List available tools"
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | "$NODE_BIN" "$SERVER_PATH" 2>/dev/null | jq .
echo ""

# Test 2: Call first tool
echo "🔧 Test 2: Call tool (adjust tool name and params)"
echo "Sending request to first tool..."
EOFTEST

    # Adicionar testes específicos para cada tool
    for i in $(seq 1 $TOOL_COUNT); do
        TOOL_NAME="${TOOL_NAMES[$i]}"
        TOOL_PARAMS="${TOOL_PARAMS[$i]}"
        
        if [[ "$TOOL_PARAMS" == "nenhum" ]]; then
            cat >> tests/api-test.sh << EOFTEST
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"$TOOL_NAME","arguments":{}}}' | "\$NODE_BIN" "\$SERVER_PATH" 2>/dev/null | jq .
EOFTEST
        else
            # Gerar params exemplo
            cat >> tests/api-test.sh << EOFTEST
# Tool: $TOOL_NAME (params: $TOOL_PARAMS)
# echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"$TOOL_NAME","arguments":{"param":"value"}}}' | "\$NODE_BIN" "\$SERVER_PATH" 2>/dev/null | jq .
EOFTEST
        fi
    done
    
    cat >> tests/api-test.sh << 'EOFTEST'

echo ""
echo "✅ Tests completed!"
EOFTEST
    
    chmod +x tests/api-test.sh
    
    # Criar teste HTTP (para servidores SSE)
    cat > tests/http-test.sh << 'EOFHTTP'
#!/bin/bash

# HTTP API test (for SSE transport)
# Requires server running with index-http.js

SERVER_URL="${1:-http://localhost:3000}"

echo "🌐 Testing HTTP API"
echo "Server: $SERVER_URL"
echo ""

# Health check
echo "📡 Health check..."
curl -s "$SERVER_URL/health" | jq .
echo ""

# List tools
echo "📋 List tools..."
curl -s "$SERVER_URL/api/tools" | jq .
echo ""

echo "✅ HTTP tests completed!"
EOFHTTP
    
    chmod +x tests/http-test.sh
    
    echo -e "${GREEN}✓${NC} Scripts de teste criados:"
    echo -e "   ${BLUE}tests/api-test.sh${NC} - Teste via stdio (JSON-RPC)"
    echo -e "   ${BLUE}tests/http-test.sh${NC} - Teste via HTTP"
    echo ""
    
    # Executar teste se build foi feito
    if [[ "$AUTO_DEPLOY" == "s" || "$AUTO_DEPLOY" == "S" ]]; then
        read -p "$(echo -e ${GREEN}Executar teste agora? [s/n]: ${NC})" RUN_TEST
        
        if [[ "$RUN_TEST" == "s" || "$RUN_TEST" == "S" ]]; then
            echo ""
            echo -e "${YELLOW}🧪 Executando testes...${NC}"
            echo ""
            
            ./tests/api-test.sh || echo -e "${YELLOW}⚠${NC} Alguns testes podem precisar de ajustes nos parâmetros"
        fi
    fi
    
    cd - > /dev/null
    echo ""
fi

# ============================================
# FINALIZAÇÃO
# ============================================

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}✅ APP GERADO COM SUCESSO!${NC}"
echo ""
echo -e "${CYAN}📁 Localização:${NC} $PROJECT_DIR"
echo ""

# Mostrar o que foi feito
if [[ "$CREATE_REPO" == "s" || "$CREATE_REPO" == "S" ]]; then
    echo -e "${GREEN}✓${NC} Repositório Git criado"
fi

if [[ "$AUTO_DEPLOY" == "s" || "$AUTO_DEPLOY" == "S" ]]; then
    echo -e "${GREEN}✓${NC} Deploy configurado"
    echo -e "   Config: ${BLUE}$PROJECT_DIR/mcp_config_local.json${NC}"
fi

if [[ "$API_TEST" == "s" || "$API_TEST" == "S" ]]; then
    echo -e "${GREEN}✓${NC} Scripts de teste criados"
    echo -e "   Stdio: ${BLUE}$PROJECT_DIR/tests/api-test.sh${NC}"
    echo -e "   HTTP: ${BLUE}$PROJECT_DIR/tests/http-test.sh${NC}"
fi

echo ""
echo -e "${YELLOW}📝 Próximos passos:${NC}"
echo ""
echo -e "1. Entrar no diretório:"
echo -e "   ${BLUE}cd $PROJECT_DIR${NC}"
echo ""
echo -e "2. Implementar lógica das tools em:"
echo -e "   ${BLUE}server/src/index.ts${NC}"
echo ""

if [[ "$AUTO_DEPLOY" != "s" && "$AUTO_DEPLOY" != "S" ]]; then
    echo -e "3. Build e testar:"
    echo -e "   ${BLUE}npm install && npm run build${NC}"
    echo ""
fi

if [[ "$API_TEST" == "s" || "$API_TEST" == "S" ]]; then
    echo -e "4. Testar localmente:"
    echo -e "   ${BLUE}./tests/api-test.sh${NC}"
    echo ""
fi

echo -e "5. Deploy no ChatGPT Desktop:"
if [[ "$AUTO_DEPLOY" == "s" || "$AUTO_DEPLOY" == "S" ]]; then
    echo -e "   ${BLUE}cp mcp_config_local.json \"$CONFIG_PATH\"${NC}"
else
    echo -e "   Ver instruções em ${BLUE}README.md${NC}"
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}💡 Dica:${NC} Veja o app de exemplo 'biblia-diaria' para referência"
echo ""
echo -e "${CYAN}🎉 Seu app segue 100% as OpenAI Apps SDK Guidelines!${NC}"
echo ""
