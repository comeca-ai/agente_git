# 🎨 FastMCP App Template

Ao executar `./create-fastmcp-app.sh`, você será guiado para criar seu app.

## 💭 Prepare-se Antes

Pense nas seguintes perguntas antes de começar:

### 1. Problema & Usuário
- **Que problema específico seu app resolve?**
  - Exemplo: "Usuários perdem tempo pesquisando clima"
  - Exemplo: "Difícil acompanhar tarefas diárias"
  - Exemplo: "Falta inspiração espiritual"

- **Quem é o usuário-alvo?**
  - Exemplo: "Pessoas planejando o dia"
  - Exemplo: "Profissionais ocupados"
  - Exemplo: "Pessoas buscando orientação"

### 2. Nome & Descrição
- **Nome do app** (kebab-case: clima-tempo, tarefas-ia)
  - Curto e descritivo
  - Fácil de lembrar
  - Relacionado ao propósito

- **Descrição em 1 linha**
  - Exemplo: "Consulta clima em tempo real"
  - Exemplo: "Gerenciador inteligente de tarefas"
  - Exemplo: "Versículos bíblicos diários"

### 3. Tools (1-3 máximo)

**Princípio FastMCP: 1 tool = 1 intention**

Para cada tool, defina:

#### Tool 1
- **Nome:** `nome_da_tool` (snake_case)
- **O que faz?** (1 frase clara)
- **Parâmetros:** lista separada por vírgula ou "nenhum"

Exemplos:
```
Nome: obter_clima_atual
Faz: Obtém temperatura e condições atuais
Parâmetros: cidade

Nome: criar_tarefa
Faz: Cria nova tarefa com título e prioridade
Parâmetros: titulo, prioridade

Nome: versiculo_diario
Faz: Obtém versículo aleatório do dia
Parâmetros: nenhum
```

#### Tool 2 (opcional)
Repita o processo...

#### Tool 3 (opcional)
Máximo recomendado...

### 4. Agentes (opcional)

**Use apenas se precisar de:**
- Orquestração complexa
- Múltiplos especialistas
- Decisões inteligentes

Para cada agente:
- **Nome:** Ex: "Organizador", "Validador", "Sugestor"
- **Especialidade:** O que ele faz de único?

### 5. Widget (opcional)

**Precisa de interface visual?**
- ✅ Sim: Dados tabulares, gráficos, listas
- ❌ Não: Respostas de texto são suficientes

## 📝 Exemplos Prontos

### App de Clima
```yaml
Problema: Consultar clima rapidamente
Usuário: Pessoas planejando o dia
Nome: clima-tempo
Descrição: Clima em tempo real por cidade

Tools: 2
  1. obter_clima (cidade)
  2. obter_previsao (cidade, dias)

Agentes: não
Widget: não
```

### App de Notícias
```yaml
Problema: Acompanhar notícias relevantes
Usuário: Profissionais informados
Nome: noticias-ia
Descrição: Notícias personalizadas por tópico

Tools: 3
  1. buscar_noticias (topico)
  2. listar_topicos ()
  3. resumir_noticia (url)

Agentes: sim
  1. Curador - seleciona relevantes
  2. Resumidor - cria resumos

Widget: sim (lista de notícias)
```

### App de Finanças
```yaml
Problema: Controlar gastos pessoais
Usuário: Pessoas organizando finanças
Nome: financas-pessoais
Descrição: Controle de gastos e receitas

Tools: 3
  1. registrar_gasto (valor, categoria)
  2. listar_gastos (mes)
  3. obter_resumo (mes)

Agentes: sim
  1. Analisador - identifica padrões
  2. Conselheiro - sugere economia

Widget: sim (gráficos)
```

## 🚀 Pronto para Começar?

```bash
./create-fastmcp-app.sh
```

Siga as perguntas e veja a mágica acontecer!

## 💡 Dicas Importantes

1. **Comece simples:** 1 tool é melhor que 3 confusas
2. **Nome claro:** Usuário deve entender o que faz
3. **Sem over-engineering:** Agentes só se necessário
4. **Teste rápido:** Build e teste antes de adicionar mais
5. **Itere:** Adicione features gradualmente

## 🎯 Depois de Criar

1. Entre no diretório: `cd apps/seu-app`
2. Instale: `npm install`
3. Implemente: Edite `server/src/index.ts`
4. Build: `npm run build`
5. Teste: `npm start`
6. Deploy: Veja README.md do seu app

---

**Pronto para criar algo incrível?** 🚀
