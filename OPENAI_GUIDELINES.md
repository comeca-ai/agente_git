# ✅ OpenAI Apps SDK Guidelines Compliance

Este guia garante que seu app FastMCP siga todas as **[OpenAI Apps SDK Submission Guidelines](https://developers.openai.com/apps-sdk/app-submission-guidelines)**.

## 📋 6 Categorias de Compliance

### 1. ✅ Tool Design (FastMCP Style)

**Guideline:** 1 tool = 1 clear intention

✅ **O que fazer:**
- Máximo 1-3 tools por app
- Nomes descritivos (verb_object pattern)
- Uma responsabilidade por tool

❌ **O que evitar:**
- Tools "do_everything"
- Nomes genéricos ("process", "handle")
- Múltiplas funções em uma tool

**Exemplo Bom:**
```typescript
// ✅ Clara e focada
{
  name: "obter_clima_atual",
  description: "Obtém temperatura e condições climáticas atuais de uma cidade",
  inputSchema: { cidade: "string" }
}
```

**Exemplo Ruim:**
```typescript
// ❌ Muito genérica
{
  name: "processar_dados",
  description: "Processa dados do usuário",
  inputSchema: { data: "any" }
}
```

### 2. ✅ Security

**Guidelines:**
- Input validation
- No secrets in responses
- Error handling
- Defense against injection

✅ **Checklist:**
```typescript
// 1. Validação de entrada com Zod
const schema = z.object({
  cidade: z.string().min(1).max(100)
});
const validated = schema.parse(args);

// 2. Nenhum secret hardcoded
// ❌ const API_KEY = "abc123";
// ✅ const API_KEY = process.env.API_KEY;

// 3. Error handling
try {
  // lógica
} catch (error) {
  return {
    content: [{ type: "text", text: "Error message" }],
    isError: true  // ← Importante!
  };
}

// 4. Sanitização de inputs
const sanitized = input.trim().slice(0, 100);
```

### 3. ✅ Privacy & Data

**Guidelines:**
- No PII collection
- Minimal data exposure
- Clear data handling

✅ **Compliance:**
```markdown
## Privacy Statement (no README)

- ✅ No personal data collected
- ✅ No user tracking
- ✅ No data storage
- ✅ All operations are read-only (quando aplicável)
```

❌ **Evitar coletar:**
- Email addresses
- Phone numbers
- Physical addresses
- Credit card numbers
- Social Security Numbers
- Any identifying information

### 4. ✅ Annotations

**Guidelines:**
- Clear tool descriptions
- Proper input schemas
- readOnlyHint for read-only tools

✅ **Implementação:**
```typescript
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "obter_clima",
        // Descrição clara e específica
        description: "Use this when the user wants to know the current weather in a city. Returns temperature, conditions, and humidity.",
        // Schema explícito
        inputSchema: {
          type: "object",
          properties: {
            cidade: {
              type: "string",
              description: "Nome da cidade (ex: São Paulo)"
            }
          },
          required: ["cidade"]
        },
        // Hint para read-only (opcional mas recomendado)
        annotations: {
          readOnlyHint: true
        }
      }
    ]
  };
});
```

### 5. ✅ Documentation

**Guidelines:**
- Clear README
- Usage examples
- Setup instructions
- Privacy policy

✅ **README deve conter:**
```markdown
# App Name

## O que faz
Descrição clara do propósito

## Tools Disponíveis
Lista de todas as tools e parâmetros

## Quick Start
Instruções de instalação e uso

## Security & Privacy
- Não coleta dados pessoais
- Input validation
- Error handling

## Exemplos de Uso
Prompts de exemplo

## Support
Como obter ajuda
```

### 6. ✅ Performance & Reliability

**Guidelines:**
- Error handling
- Graceful degradation
- Response times
- Edge cases

✅ **Best Practices:**
```typescript
// 1. Async operations
async function getTool(args: any) {
  try {
    const result = await fetchData(args);
    return result;
  } catch (error) {
    // Graceful error
    return { error: "Service unavailable" };
  }
}

// 2. Timeouts
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000);

// 3. Default cases
switch (toolName) {
  case "tool1": return handle1();
  case "tool2": return handle2();
  default: 
    return { error: "Unknown tool" };
}

// 4. Edge cases
if (!input || input.trim() === '') {
  return { error: "Input required" };
}
```

## 🛠️ Validação Automática

### Validar Compliance

```bash
# Validar app atual
npm run validate:openai

# Validar app específico
npx ts-node builder/src/openai-compliance.ts apps/seu-app

# Validar tudo (FastMCP + OpenAI)
npm run validate:all
```

### Relatório de Compliance

O validador verifica:
1. ✅ Tool Design (1-3 tools, nomes claros)
2. ✅ Security (validation, error handling)
3. ✅ Privacy (no PII, privacy statement)
4. ✅ Annotations (descriptions, schemas)
5. ✅ Documentation (README completo)
6. ✅ Performance (async, error handling)

**Output:**
```
╔══════════════════════════════════════════════════════════╗
║     OpenAI Apps SDK Compliance Report                   ║
╚══════════════════════════════════════════════════════════╝

✅ 1. Tool Design (FastMCP)
  ✓ Tool Count: Found 2 tools (recommended: 1-3)
  ✓ Explicit Schemas: Zod schemas found
  ✓ Clear Names: Tools use descriptive names
  ✓ Tool Descriptions: Tools have descriptions

✅ 2. Security
  ✓ Input Validation: Input validation implemented
  ✓ Error Handling: Error handling present
  ✓ No Hardcoded Secrets: No hardcoded secrets detected
  ✓ Error Flag Usage: Uses isError flag correctly

[... mais categorias ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall: 18/18 checks passed

✅ READY FOR SUBMISSION!
Your app follows OpenAI Apps SDK guidelines.
```

## 📝 Checklist de Submissão

Use este checklist antes de submeter seu app:

### Código
- [ ] 1-3 tools com nomes claros
- [ ] Schemas Zod para validação
- [ ] Error handling com try-catch
- [ ] isError flag em erros
- [ ] Sem secrets hardcoded
- [ ] Default case em switch statements

### Segurança
- [ ] Validação de todos os inputs
- [ ] Sanitização de dados
- [ ] Nenhuma informação sensível em responses
- [ ] Error messages seguros

### Privacy
- [ ] Não coleta PII
- [ ] Statement de privacy no README
- [ ] Data handling documentado
- [ ] Operações read-only marcadas

### Documentação
- [ ] README completo
- [ ] Descrição clara do propósito
- [ ] Lista de tools disponíveis
- [ ] Exemplos de uso
- [ ] Instruções de instalação
- [ ] Privacy policy

### Testes
- [ ] Testado localmente
- [ ] Golden prompts funcionam
- [ ] Edge cases cobertos
- [ ] Error cases testados
- [ ] Validação passou: `npm run validate:all`

## 🚀 Apps Gerados com FastMCP Builder

**Boa notícia!** Apps criados com `./create-fastmcp-app.sh` já seguem automaticamente as guidelines da OpenAI:

✅ Templates compliance
✅ Validação de inputs com Zod
✅ Error handling correto
✅ README completo
✅ Privacy statement incluído
✅ Schemas explícitos

Você só precisa:
1. Implementar a lógica das tools
2. Testar localmente
3. Rodar `npm run validate:all`
4. Submeter!

## 📚 Recursos Oficiais

- [Apps SDK Guidelines](https://developers.openai.com/apps-sdk/app-submission-guidelines)
- [Apps SDK Documentation](https://platform.openai.com/docs/guides/apps)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [FastMCP Style Guide](https://github.com/modelcontextprotocol/mcp)

## 💡 Dicas para Aprovação

1. **Seja específico:** Tools devem ter propósito claro
2. **Documente bem:** README detalhado aumenta aprovação
3. **Teste tudo:** Golden prompts e edge cases
4. **Privacidade primeiro:** Deixe claro que não coleta dados
5. **Valide sempre:** `npm run validate:all` antes de submeter

## 🎯 Exemplos Compliant

### App Simples (1 tool)
```typescript
// Clima - consulta temperatura
{
  name: "obter_temperatura",
  description: "Gets current temperature for a city",
  inputSchema: { cidade: "string" }
}
```

### App Médio (2-3 tools)
```typescript
// Tarefas
{
  name: "criar_tarefa",
  description: "Creates a new task with title and priority",
  inputSchema: { titulo: "string", prioridade: "string" }
},
{
  name: "listar_tarefas",
  description: "Lists all tasks",
  inputSchema: {}
}
```

## ✅ Conclusão

Seguindo este guia, seu app estará em **compliance total** com as guidelines da OpenAI e pronto para submissão!

**Próximo passo:** Rode `npm run validate:all` e veja seu relatório! 🚀
