# 🎯 Promessas de Ano Novo

Gerenciador de promessas de ano novo com lembretes mensais automáticos.

## 📋 Funcionalidades

### 🔧 4 Tools MCP

1. **adicionarPromessa** - Adiciona nova promessa
   - `titulo`: string - Título da promessa
   - `descricao`: string - Descrição detalhada
   - `mes_alvo`: number (1-12) - Mês para ser lembrado

2. **listarPromessas** - Lista e filtra promessas
   - `mes`: number (opcional) - Filtrar por mês específico
   - `status`: "pendente" | "cumprida" | "todas" - Filtrar por status

3. **atualizarStatus** - Atualiza status da promessa
   - `id`: number - ID da promessa
   - `status`: "pendente" | "cumprida" - Novo status

4. **lembretesMes** - Lembretes do mês
   - `mes`: number (opcional, padrão: mês atual) - Mês para ver lembretes

## 🚀 Como Usar

### Teste Local

```bash
# Instalar dependências
npm install

# Build (já compilado)
npm run build

# Testar com MCP Inspector
npx @modelcontextprotocol/inspector node server/dist/index.js
```

Acesse: http://localhost:6274

### Deploy FastMCP Cloud

#### Opção 1: Script Automático

```bash
cd /workspaces/agente_git
./deploy-fastmcp-cloud.sh projetos/promessas-ano-novo
```

#### Opção 2: Deploy Manual

1. **Criar pacote**:
```bash
cd projetos/promessas-ano-novo
tar -czf deploy.tar.gz server/dist/ package.json package-lock.json
```

2. **Upload via FastMCP CLI**:
```bash
fastmcp deploy --name promessas-ano-novo --file deploy.tar.gz
```

3. **Via API**:
```bash
curl -X POST https://api.fastmcp.com/v1/servers \
  -H "Authorization: Bearer $FASTMCP_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "promessas-ano-novo",
    "runtime": "nodejs18",
    "transport": "stdio"
  }'
```

### Configuração ChatGPT Desktop

Adicione em `~/.config/OpenAI/ChatGPT/mcp_config.json`:

```json
{
  "mcpServers": {
    "promessas-ano-novo": {
      "command": "node",
      "args": ["/path/to/projetos/promessas-ano-novo/server/dist/index.js"],
      "transport": "stdio"
    }
  }
}
```

Ou para FastMCP Cloud:

```json
{
  "mcpServers": {
    "promessas-ano-novo": {
      "url": "https://YOUR-SERVER-ID.fastmcp.com",
      "transport": "stdio",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

## 📝 Exemplos de Uso

### Adicionar Promessa

```
Adicione minha promessa: "Fazer exercícios 3x por semana"
Descrição: "Academia segunda, quarta e sexta às 7h"
Me lembre em março
```

### Listar Promessas

```
Mostre minhas promessas de março
```

```
Mostre todas as promessas pendentes
```

### Atualizar Status

```
Marquei a promessa #1 como cumprida
```

### Ver Lembretes do Mês

```
Quais são meus lembretes de abril?
```

## 🎨 Recursos

✅ **Armazenamento**: Em memória (persistente durante execução)  
📅 **Lembretes**: Automáticos por mês  
🔔 **Notificações**: Exibe promessas do mês atual  
📊 **Filtros**: Por mês, status ou ambos  
🎉 **Celebração**: Mensagem especial ao cumprir promessa  

## 🏗️ Estrutura

```
promessas-ano-novo/
├── server/
│   ├── src/
│   │   └── index.ts       # Servidor MCP
│   ├── dist/
│   │   └── index.js       # Build compilado
│   └── tsconfig.json
├── package.json
└── README.md
```

## 🔒 Segurança

- ✅ Validação Zod em todos os parâmetros
- ✅ OpenAI Apps SDK 21/21 compliant
- ✅ Mensagens de erro descritivas
- ✅ Try/catch em todas as operações

## 📦 Dependências

- `@modelcontextprotocol/sdk`: ^1.0.4
- `zod`: ^3.24.1
- `typescript`: ^5.3.0

## 🐛 Troubleshooting

### TypeScript Build Timeout

Se `npm run build` travar:

```bash
# Build já está compilado em server/dist/index.js
# Use diretamente:
node server/dist/index.js
```

### FastMCP Cloud Connection Error

Se houver erro HTTP/2:

```bash
# Tente novamente após alguns segundos
# Ou use deploy manual via CLI
```

---

**Criado com**: MCP Builder Natural  
**Data**: Dezembro 2025  
**Versão**: 1.0.0
