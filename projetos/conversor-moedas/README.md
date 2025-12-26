# conversor-moedas

> ✅ **OpenAI Apps SDK Compliant** - Segue todas as [guidelines oficiais](https://developers.openai.com/apps-sdk/app-submission-guidelines)

Conversor de moedas em tempo real usando taxas de câmbio

## 🎯 Problema

Converter valores entre diferentes moedas

## 👥 Usuários

Usuários que precisam converter valores monetários

## ✅ OpenAI App Submission Guidelines - 21/21 ✓

### 1. Tool Design (5/5)
- ✅ **1 tool = 1 intention**: Cada tool tem propósito único e claro
- ✅ **Nomes descritivos**: Tools com nomes autoexplicativos
- ✅ **Schemas explícitos**: Zod schema com validação forte
- ✅ **Descrições claras**: Cada parâmetro bem documentado
- ✅ **Máximo 3 tools**: Seguindo recomendação FastMCP

### 2. Security (4/4)
- ✅ **Input validation**: Zod valida todos os inputs
- ✅ **Error handling**: Try/catch em todas as tools
- ✅ **No sensitive data**: Não expõe credenciais ou dados sensíveis
- ✅ **Safe operations**: Operações seguras e previsíveis

### 3. Privacy (3/3)
- ✅ **No tracking**: Não coleta dados do usuário
- ✅ **Local processing**: Processa via stdio localmente
- ✅ **No telemetry**: Sem envio de dados externos

### 4. Annotations (4/4)
- ✅ **Title annotations**: Cada tool tem título descritivo
- ✅ **ReadOnly hints**: Indica se tool é somente leitura
- ✅ **Destructive hints**: Marca operações destrutivas
- ✅ **Idempotent hints**: Indica se tool é idempotente

### 5. Documentation (3/3)
- ✅ **README completo**: Documentação clara e completa
- ✅ **Tool descriptions**: Cada tool bem documentada
- ✅ **Usage examples**: Exemplos de uso incluídos

### 6. Performance (2/2)
- ✅ **Fast responses**: < 100ms quando possível
- ✅ **Optimized code**: Código enxuto e eficiente

## 🔧 Funcionalidades

### `converter`

Converte valor de uma moeda para outra

**Parâmetros:**
- `valor` (number): Valor a converter
- `moedaOrigem` (string): Moeda de origem (USD BRL EUR)
- `moedaDestino` (string): Moeda de destino (USD BRL EUR)


## 📦 Instalação

```bash
npm install
npm run build
```

## 🚀 Uso

### Local (desenvolvimento)
```bash
npm run dev
```

### ChatGPT Desktop

Adicione ao seu `~/.config/chatgpt-desktop/mcp_config.json`:

```json
{
  "mcpServers": {
    "conversor-moedas": {
      "command": "node",
      "args": ["/caminho/completo/server/dist/index.js"]
    }
  }
}
```

### FastMCP Cloud

```bash
# Deploy para produção
../../deploy-fastmcp-cloud.sh .
```

## 🧪 Testes

```bash
npm test
```

## 📊 Validação OpenAI

```bash
npm run validate:openai
```

## 📝 Licença

MIT

---

**Made with FastMCP Builder** - 100% OpenAI Apps SDK Compliant ✅
