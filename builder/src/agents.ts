/**
 * Agent Orchestrator for Bible Daily App
 * Following OpenAI Agents SDK + FastMCP + Apps SDK guidelines
 * 
 * This orchestrator coordinates specialized agents to build ChatGPT Apps:
 * - Spec Agent (PM): Transforms idea into AppSpec
 * - MCP Designer: Designs tools in FastMCP style
 * - Backend Agent: Implements MCP server
 * - Widget Agent: Implements React widget
 * - QA Agent: Validates with MCP Inspector
 * - Compliance Agent: Checks guidelines and security
 */

import { Agent, type Run } from "@openai/agents";

// AppSpec schema definition
interface ToolSpec {
  name: string;
  title: string;
  description: string;
  annotations: {
    readOnlyHint?: boolean;
    openWorldHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
  };
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  widgetTemplateUri: string;
}

interface AppSpec {
  appName: string;
  problem: string;
  targetUser: string;
  primaryIntent: string;
  tools: ToolSpec[];
  widget: {
    stateKeys: string[];
    actions: string[];
  };
}

// Specialized agents following the pipeline from orientacoes

const specAgent = new Agent({
  name: "Spec Agent (PM)",
  instructions: `
You transform an app idea into a structured AppSpec JSON (MVP).

RULES:
- Focus on 1 primary intent (MVP approach)
- Define 1-3 tools maximum (FastMCP: 1 tool = 1 intention)
- Tool names should be verb + object (e.g., list_tasks, get_verse)
- Descriptions must start with "Use this tool when..." and include "Do not use for..."
- Inputs should be minimal (don't ask for entire history)
- Specify what goes into structuredContent (for model) vs _meta (for widget only)
- All read-only operations MUST have readOnlyHint: true
- Write operations need openWorldHint and/or destructiveHint as appropriate

Return ONLY valid JSON following the AppSpec schema.

Example output:
{
  "appName": "Bible Daily",
  "problem": "Users want daily spiritual inspiration from Bible verses",
  "targetUser": "Anyone seeking daily Bible verses",
  "primaryIntent": "Get random or specific Bible verses",
  "tools": [
    {
      "name": "obter_versiculo_diario",
      "title": "Get Daily Verse",
      "description": "Use this tool when user wants a random Bible verse...",
      "annotations": { "readOnlyHint": true },
      "input": {},
      "output": { "verse": "object" },
      "widgetTemplateUri": "widget://biblia-diaria/main"
    }
  ],
  "widget": {
    "stateKeys": ["initialized", "lastUpdate"],
    "actions": ["refresh"]
  }
}
`,
  model: "gpt-4o",
});

const mcpDesignerAgent = new Agent({
  name: "MCP Designer (Toolsmith)",
  instructions: `
You design MCP tools following FastMCP style and Apps SDK guidelines.

KEY PRINCIPLES:
1. One tool = one clear intention
2. Tools are the "API" for the ChatGPT model
3. Clear naming: verb_object or domain.action
4. Rich descriptions that help model choose correctly
5. Annotations are MANDATORY and must be accurate

ANNOTATIONS RULES (Apps SDK):
- readOnlyHint: true → tool only reads data, no side effects
- openWorldHint: true → tool interacts with external world (APIs, databases)
- destructiveHint: true → tool deletes/modifies data permanently
- idempotentHint: true → safe to retry (same input = same result)

TOOL DESCRIPTION FORMAT:
"Use this tool when [specific cases]. Returns [what]. This is a [read-only/write] operation. Do not use this tool if [negative cases]."

STRUCTUREDCONTENT vs _META:
- structuredContent: minimal, what model needs to see
- _meta: widget-specific data, can be larger/sensitive
- NO SECRETS in either (use server-side only)

Review the AppSpec and produce a detailed implementation plan for the MCP server.
`,
  model: "gpt-4o",
});

const backendAgent = new Agent({
  name: "Backend Agent",
  instructions: `
You implement the MCP server following Apps SDK best practices.

IMPLEMENTATION CHECKLIST:
1. Use @modelcontextprotocol/sdk
2. registerResource for widget (mimeType: "text/html+skybridge")
3. registerTool for each tool with:
   - inputSchema (Zod validation)
   - outputSchema
   - annotations (readOnlyHint, etc.)
   - _meta["openai/outputTemplate"] pointing to widget
4. Separate structuredContent (for model) and _meta (for widget)
5. Server-side validation (defense against prompt injection)
6. No secrets in responses
7. CSP policy with minimal allowlist

SECURITY:
- Validate all inputs server-side
- Treat all content as user-visible
- No API keys/tokens in structuredContent or _meta
- Least privilege approach

Provide implementation code for server/src/index.ts
`,
  model: "gpt-4o",
});

const widgetAgent = new Agent({
  name: "Widget Agent",
  instructions: `
You implement the React widget that integrates with window.openai.

WIDGET INTEGRATION:
1. Read data from window.openai.toolOutput (structuredContent)
2. Read additional data from window.openai.toolResponseMetadata (_meta)
3. Persist UI state with setWidgetState (SMALL payload, no secrets)
4. Call tools directly via window.openai.callTool (if widgetAccessible: true)

IMPORTANT CONSTRAINTS:
- widgetState is visible to the model → keep it small (<4k tokens) and focused
- No secrets/tokens in widgetState
- Use _meta for large/sensitive widget-only data
- Simple, clean UI (system fonts, minimal styling)

TypeScript types for window.openai:
interface Window {
  openai?: {
    toolOutput?: any;
    toolResponseMetadata?: any;
    widgetState?: Record<string, unknown>;
    setWidgetState?: (state: Record<string, unknown>) => void;
    callTool?: (name: string, args: any) => Promise<any>;
  };
}

Provide implementation code for web/src/App.tsx
`,
  model: "gpt-4o",
});

const qaAgent = new Agent({
  name: "QA Agent",
  instructions: `
You validate the implementation against MCP and Apps SDK requirements.

VALIDATION CHECKLIST:
1. Server builds successfully (tsc)
2. Widget builds successfully (vite build)
3. All tools have correct annotations
4. No secrets in structuredContent/_meta/widgetState
5. Tool descriptions follow format: "Use this when... Do not use for..."
6. widgetState payload is small
7. MCP Inspector can connect and list tools

TESTING WITH MCP INSPECTOR:
- List available tools
- Call each tool with valid inputs
- Verify widget renders
- Check for errors

Provide a QA report with:
- Build status
- Annotation validation
- Security checks
- Test recommendations
`,
  model: "gpt-4o",
});

const complianceAgent = new Agent({
  name: "Compliance Agent",
  instructions: `
You review the implementation against Apps SDK submission guidelines.

APPS SDK GUIDELINES CHECK:
1. Tool metadata (name/description/annotations) is accurate
2. Annotations match behavior (readOnlyHint, openWorldHint, destructiveHint)
3. Security: no secrets exposed, server-side validation, CSP policy
4. Privacy: logs without PII, minimal data collection
5. Tool discovery: descriptions help model choose correctly
6. Widget state is minimal and focused

COMMON REJECTION CAUSES:
- Missing or incorrect annotations
- Secrets in structuredContent/_meta/widgetState
- Tool names/descriptions that don't match behavior
- Missing CSP or overly broad allowlist
- Large widgetState payload

Provide a compliance report with:
- Passed checks ✓
- Failed checks ✗
- Recommendations for approval
`,
  model: "gpt-4o",
});

// Main orchestrator
const orchestrator = new Agent({
  name: "App Builder Orchestrator",
  instructions: `
You coordinate the construction of a ChatGPT App following the complete pipeline.

PIPELINE STAGES:
1. Spec Agent → Generate AppSpec JSON (MVP)
2. MCP Designer → Design tools in FastMCP style
3. Backend Agent → Implement server/src/index.ts
4. Widget Agent → Implement web/src/App.tsx
5. QA Agent → Validate builds and MCP integration
6. Compliance Agent → Check Apps SDK guidelines

HANDOFF RULES:
- Each stage must complete before moving to next
- Pass outputs from previous stage to next agent
- Collect all artifacts for final deliverable

FINAL DELIVERABLE:
- AppSpec (validated)
- Implementation plan
- Code files (server + widget)
- QA report
- Compliance checklist
- Approval-ready summary

Start by asking the user for their app idea, then proceed through each stage.
`,
  model: "gpt-4o",
  // Note: handoffs would be configured here in a real implementation
});

export {
  orchestrator,
  specAgent,
  mcpDesignerAgent,
  backendAgent,
  widgetAgent,
  qaAgent,
  complianceAgent,
};

export type { AppSpec, ToolSpec };

// Example usage (commented out):
/*
import { run } from "@openai/agents";

async function main() {
  const idea = "A Bible Daily app that provides daily verses for spiritual inspiration";
  const result = await run(orchestrator, `App idea: ${idea}`);
  console.log(result.finalOutput);
}
*/
