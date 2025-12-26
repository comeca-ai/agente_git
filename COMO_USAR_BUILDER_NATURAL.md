# 🚀 Builder Natural - Como Usar

## 📝 Modo de Uso

```bash
./create-app-natural.sh
```

## 💬 Como Descrever Seu App

Ao executar o builder, você verá:

```
💬 DESCREVA SEU APP LIVREMENTE

Exemplos:
  • Quero um conversor de moedas que aceite valor e moedas
  • Preciso calcular juros compostos com capital, taxa e tempo
  • Um gerador de senhas fortes com comprimento configurável
  • Ferramenta para converter celsius em fahrenheit

📝 Digite sua descrição (pressione Enter 2x quando terminar):
```

### ✅ Boas Descrições

**Exemplo 1: Conversor de Moedas**
```
Quero um conversor de moedas que aceite o valor em reais
e converta para dólar, euro ou outras moedas
```

O builder vai detectar:
- Nome: `conversor-moedas`
- Tool: `converter`
- Parâmetros: `valor` (number), `moedaOrigem` (string), `moedaDestino` (string)

**Exemplo 2: Calculadora de Juros**
```
Preciso calcular juros compostos com capital inicial,
taxa de juros mensal e tempo em meses
```

O builder vai detectar:
- Nome: `calculadora-juros`
- Tool: `calcular`
- Parâmetros: `capital` (number), `taxa` (number), `tempo` (number)

**Exemplo 3: Gerador de Senhas**
```
Um gerador de senhas fortes que aceite o comprimento
desejado e gere uma senha aleatória segura
```

O builder vai detectar:
- Nome: `gerador-senhas`
- Tool: `gerar`
- Parâmetros: `comprimento` (number)

**Exemplo 4: Validador de CPF**
```
Ferramenta para validar CPF brasileiro, aceita
o número do CPF e retorna se é válido ou não
```

O builder vai detectar:
- Nome: `validador`
- Tool: `validar`
- Parâmetros: `numero` (string)

## 🤖 O Que o Builder Detecta Automaticamente

### 1. Nome do App
Baseado em palavras-chave:
- `conversor/converter` → `conversor-*`
- `calculadora/calcular` → `calculadora-*`
- `gerador/gerar` → `gerador-*`
- `validador/validar` → `validador-*`

### 2. Tool Principal (Verbo de Ação)
- `convert*` → `converter`
- `calcul*` → `calcular`
- `gera*/generat*` → `gerar`
- `valida*` → `validar`
- `busca*/search` → `buscar`
- `analisa*/analy*` → `analisar`
- `formata*/format*` → `formatar`
- `transform*` → `transformar`

### 3. Parâmetros Detectados
O builder procura por estas palavras-chave:

| Palavra-Chave | Parâmetro Gerado | Tipo |
|---------------|------------------|------|
| valor, value, amount | `valor` | number |
| moeda, currency | `moedaOrigem`, `moedaDestino` | string |
| taxa, rate, juros | `taxa` | number |
| tempo, time, período | `tempo` | number |
| capital, principal | `capital` | number |
| senha, password | `comprimento` | number |
| temperatura, celsius, fahrenheit | `temperatura` | number |
| texto, text, string | `texto` | string |
| número, number | `numero` | number |

## 📋 Fluxo Completo

```
1. Digite descrição livre
2. Builder analisa e detecta:
   - Nome do app
   - Tool principal
   - Parâmetros necessários
3. Mostra preview da análise
4. Confirma ou ajusta manualmente
5. Perguntas rápidas:
   - Interface visual? [s/n]
   - Prompts/agentes? [s/n]
6. Preview final
7. Confirma e gera código
8. App criado com:
   ✅ 21/21 OpenAI Guidelines
   ✅ TypeScript compilado
   ✅ Git inicializado
   ✅ Testes funcionando
   ✅ README completo
9. Oferece:
   - Criar repo no GitHub
   - Deploy no FastMCP Cloud
```

## 🎯 Vantagens Deste Modo

### ✅ Natural
- Descreve como quiser
- Sem formato rígido
- Sem sintaxe especial

### ✅ Inteligente
- Detecta nome automaticamente
- Identifica parâmetros mencionados
- Sugere tipos corretos

### ✅ Rápido
- Apenas 2-3 perguntas adicionais
- Análise automática
- Preview antes de gerar

### ✅ Flexível
- Pode ajustar manualmente
- Preview editável
- Confirma cada passo

## 🆚 Comparação com Outros Modos

| Modo | Perguntas | Flexibilidade | Velocidade |
|------|-----------|---------------|------------|
| **create-app-natural.sh** | 1 principal + 2 extras | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| create-app-interactive.sh | 9 sequenciais | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| create-fastmcp-app.sh | 17 sequenciais | ⭐⭐⭐ | ⭐⭐ |
| create-app-from-config.sh | 0 (usa JSON) | ⭐⭐ | ⭐⭐⭐⭐⭐ |

## 🧪 Teste Agora!

```bash
./create-app-natural.sh
```

Digite algo como:
```
Quero uma calculadora que some dois números e retorne o resultado
```

E veja a mágica acontecer! ✨

## 📝 Dicas

1. **Seja específico** sobre os dados que precisa
2. **Mencione os parâmetros** na descrição
3. **Use verbos de ação** (calcular, converter, gerar)
4. **Descreva o problema**, não a solução
5. **Pressione Enter 2x** quando terminar de digitar

## 🎬 Exemplo Completo

```bash
$ ./create-app-natural.sh

╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     🚀 FastMCP App Builder - Modo Natural                   ║
║     Descreva seu app do jeito que quiser!                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

💬 DESCREVA SEU APP LIVREMENTE

📝 Digite sua descrição (pressione Enter 2x quando terminar):

> Quero um conversor que transforme temperatura de
> celsius para fahrenheit e vice-versa
>
[Enter 2x]

⏳ Analisando sua descrição...

🤖 ENTENDI O SEGUINTE:

📦 Nome sugerido: conversor-temperatura
🎯 Problema: Quero um conversor que transforme temperatura...
🔧 Tool principal: converter
📋 Parâmetros detectados: 2
     • temperatura (number)
     • [tipo conversão detectado]

Usar essa análise como base? [s/n]: s

🎨 CONFIGURAÇÕES RÁPIDAS

Precisa de interface visual? [s/n]: n
Usar prompts/agentes? [s/n]: n

📋 PREVIEW DO SEU APP

📦 Nome: conversor-temperatura
🔧 Tool: converter
📋 Parâmetros: 2
   • temperatura (number)
   • tipo (string)

Confirmar e gerar código? [s/n]: s

[1/8] Criando estrutura...
[2/8] Gerando servidor MCP...
[3/8] Gerando package.json...
[4/8] Gerando README...
[5/8] Gerando testes...
[6/8] Instalando dependências...
[7/8] Compilando TypeScript...
[8/8] Inicializando Git...

✨ APP CRIADO COM SUCESSO!

📦 Nome: conversor-temperatura
📍 Localização: apps/conversor-temperatura/

✅ Validações:
   ✓ 21/21 OpenAI Guidelines
   ✓ TypeScript compilado
   ✓ Git inicializado
   ✓ Testes criados
   ✓ Documentação completa
```

## 💡 Próximos Passos Após Criar

1. **Testar localmente:**
   ```bash
   cd apps/seu-app
   npm test
   node server/dist/index.js
   ```

2. **Implementar lógica:**
   Edite `server/src/index.ts` e substitua o `// TODO` pela sua lógica

3. **Deploy:**
   ```bash
   # GitHub
   gh repo create seu-app --public --source=. --push
   
   # FastMCP Cloud
   cd /workspaces/agente_git
   ./deploy-fastmcp-cloud.sh projetos/seu-app
   ```

## 🎉 Pronto!

Agora você tem a forma **mais fácil e natural** de criar MCP servers com OpenAI compliance! 🚀
