# Agent Orchestration Flow

## Overview

This document explains the complete agent orchestration system implemented for building ChatGPT Apps following the guidelines from `orientacoes`.

## Architecture Pattern

The system uses **OpenAI Agents SDK** with a **central orchestrator + specialized agents** pattern:

```
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR                              │
│  (Coordinates entire pipeline with handoffs)                 │
└──────┬──────────────────────────────────────────────────────┘
       │
       ├─► Spec Agent (PM)
       │   └─► Transforms idea into AppSpec JSON
       │       Output: app_spec.json
       │
       ├─► MCP Designer Agent (Toolsmith)
       │   └─► Designs tools in FastMCP style
       │       Output: tools.contract.json
       │
       ├─► Backend Agent
       │   └─► Implements MCP server
       │       Output: server/src/index.ts
       │
       ├─► Widget Agent
       │   └─► Implements React widget
       │       Output: web/src/App.tsx
       │
       ├─► QA Agent
       │   └─► Validates builds and tests
       │       Output: qa_report.md
       │
       └─► Compliance Agent
           └─► Checks Apps SDK guidelines
               Output: compliance_checklist.md
```

## Agent Pipeline (8 Stages)

### Stage 0: Intake and Classification (Triage/PM Agent)

**Input:** Natural language app idea

**Output:** 
- `app_spec.json` (MVP definition)
- List of non-objectives (scope boundaries)

**Gate:**
- Must define 1 primary intent (MVP)
- Must define data boundaries (structuredContent vs _meta)

**Example:**
```json
{
  "appName": "Bible Daily",
  "problem": "Users want daily spiritual inspiration from Bible verses",
  "primaryIntent": "Get random or specific Bible verses",
  "tools": ["obter_versiculo_diario", "obter_versiculo_por_livro", "listar_livros_disponiveis"]
}
```

### Stage 1: Tool Design (MCP Designer - FastMCP Style)

**Input:** app_spec.json

**Output:**
- `tools.contract.json` with detailed tool specifications

**FastMCP Principles:**
- 1 tool = 1 intention
- Clear naming (verb_object)
- Explicit schemas
- Predictable responses

**Gate:**
- ALL tools have correct annotations (readOnlyHint, openWorldHint, destructiveHint)
- Tool descriptions follow format: "Use this when... Do not use for..."

**Example Tool Spec:**
```json
{
  "name": "obter_versiculo_diario",
  "description": "Use this tool when user wants a daily verse...",
  "annotations": {
    "readOnlyHint": true
  },
  "inputSchema": {},
  "outputSchema": {
    "verse": {
      "book": "string",
      "chapter": "number",
      "verse": "number",
      "text": "string"
    }
  }
}
```

### Stage 2: Metadata and Discovery

**Input:** tools.contract.json

**Output:**
- `golden_prompts.json` (test cases)
- Enhanced tool descriptions

**Gate:**
- Must have golden prompts covering:
  - Direct requests
  - Indirect requests
  - Negative cases
  - Edge cases

### Stage 3: Architecture (MCP + UI Design)

**Input:** tools.contract.json + golden_prompts.json

**Output:**
- Architecture decision document

**Decisions:**
- Which tools need widgets
- UI-only actions (refresh, paginate, etc.)
- Widget accessibility settings

**Apps SDK Critical Points:**
- `_meta["openai/widgetAccessible"]=true` for widget-callable tools
- `_meta["openai/visibility"]="private"` for widget-only tools

### Stage 4: MCP Server Implementation (Backend Agent)

**Input:** Architecture decisions + tools.contract.json

**Output:**
- `server/src/index.ts` (complete MCP server)
- `server/src/bible-data.ts` (data layer)

**Implementation Checklist:**
- ✅ Use @modelcontextprotocol/sdk
- ✅ registerResource (widget with text/html+skybridge)
- ✅ registerTool (with schemas and annotations)
- ✅ Separate structuredContent and _meta
- ✅ Server-side validation
- ✅ No secrets in responses
- ✅ CSP policy

**Gate:**
- Build must succeed
- No security vulnerabilities
- All tools implemented with correct annotations

### Stage 5: Widget Implementation (Frontend Agent)

**Input:** Architecture decisions + API contracts

**Output:**
- `web/src/App.tsx` (React component)

**Integration Points:**
- `window.openai.toolOutput` (structuredContent)
- `window.openai.toolResponseMetadata` (_meta)
- `window.openai.setWidgetState` (persist state)
- `window.openai.callTool` (direct tool calls)

**Gate:**
- Build must succeed
- widgetState < 4k tokens
- No secrets in widgetState

### Stage 6: Quality Assurance (QA Agent)

**Input:** Complete implementation

**Tests:**
1. Server builds (TypeScript)
2. Widget builds (Vite)
3. MCP Inspector validation
4. Golden prompts execution
5. Security scan

**Output:**
- `qa_report.md`
- Screenshots from Inspector

**Gate:**
- All builds succeed
- All tools discoverable
- Widget renders correctly

### Stage 7: Compliance Review (Compliance Agent)

**Input:** Complete implementation + QA report

**Checks:**
1. Apps SDK Submission Guidelines
   - Tool metadata accuracy
   - Annotations match behavior
   - CSP policy defined

2. Security & Privacy
   - No secrets exposed
   - Server-side validation
   - Minimal data collection

3. Tool Discovery
   - Descriptions help model choose correctly
   - Golden prompts pass

**Output:**
- `compliance_checklist.md`

**Gate:**
- All critical checks pass
- Tools frozen (no changes before submission)

## Agent Implementation Details

### Spec Agent (PM)

**Model:** GPT-4o

**Prompt Strategy:**
- Focus on MVP (minimal viable product)
- 1 primary intent
- 1-3 tools maximum
- Clear scope boundaries

**Output Format:** Structured JSON

### MCP Designer (Toolsmith)

**Model:** GPT-4o

**Expertise:**
- FastMCP patterns
- Apps SDK annotations
- Tool naming conventions
- Schema design

**Critical Checks:**
- Annotation accuracy
- Description format
- Input minimization
- Output clarity

### Backend Agent

**Model:** GPT-4o

**Expertise:**
- MCP SDK usage
- TypeScript/Node.js
- Security best practices
- Error handling

**Output:** Production-ready server code

### Widget Agent

**Model:** GPT-4o

**Expertise:**
- React patterns
- window.openai integration
- State management
- UI/UX best practices

**Output:** Production-ready widget code

### QA Agent

**Model:** GPT-4o

**Testing Strategy:**
- Build validation
- Runtime testing
- Security scanning
- Golden prompts execution

**Output:** Comprehensive QA report

### Compliance Agent

**Model:** GPT-4o

**Checklist Source:**
- Apps SDK Submission Guidelines
- Security & Privacy Guidelines
- FastMCP Best Practices

**Output:** Pass/Fail report with recommendations

## Handoff Mechanism

The Agents SDK provides built-in handoff support:

```typescript
const orchestrator = new Agent({
  name: "Orchestrator",
  instructions: "...",
  handoffs: [
    handoff(specAgent),
    handoff(mcpDesignerAgent),
    handoff(backendAgent),
    handoff(widgetAgent),
    handoff(qaAgent),
    handoff(complianceAgent),
  ],
});
```

## Gates and Quality Control

Each stage has **mandatory gates** that must pass before proceeding:

| Stage | Gate |
|-------|------|
| Spec | MVP defined, scope clear |
| Design | Annotations complete, descriptions formatted |
| Architecture | Widget accessibility defined |
| Backend | Builds successfully, no security issues |
| Widget | Builds successfully, state is small |
| QA | All tests pass, Inspector validates |
| Compliance | All guidelines checks pass |

## Example: Bible Daily App Flow

1. **Spec Agent** receives: "Bible app for daily verses"
2. **Spec Agent** outputs: AppSpec with 3 tools
3. **MCP Designer** receives: AppSpec
4. **MCP Designer** outputs: Tool contracts with annotations
5. **Backend Agent** receives: Tool contracts
6. **Backend Agent** outputs: server/src/index.ts
7. **Widget Agent** receives: Tool contracts + server code
8. **Widget Agent** outputs: web/src/App.tsx
9. **QA Agent** receives: Complete implementation
10. **QA Agent** runs: Builds, tests, Inspector validation
11. **Compliance Agent** receives: QA report
12. **Compliance Agent** outputs: ✅ Approval-ready checklist

## Benefits of This Pattern

1. **Separation of Concerns:** Each agent has one job
2. **Quality Gates:** Issues caught early in pipeline
3. **Traceability:** Clear audit trail of decisions
4. **Consistency:** Following Apps SDK guidelines automatically
5. **Efficiency:** Specialized agents work faster
6. **Scalability:** Easy to add new agent types

## Next Steps

To use this system for new apps:

1. Define the app idea clearly
2. Run orchestrator with the idea
3. Review each stage output
4. Validate with MCP Inspector
5. Submit to Apps SDK

---

**Built following OpenAI Agents SDK + FastMCP + Apps SDK guidelines**
