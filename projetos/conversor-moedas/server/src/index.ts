#!/usr/bin/env node
/**
 * MCP Server - OpenAI Apps SDK Compliant
 * Segue guidelines: https://developers.openai.com/apps-sdk/app-submission-guidelines
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Criar servidor MCP
const server = new McpServer({
  name: "conversor-moedas",
  version: "1.0.0",
});

// Tool 1: converter
const converterSchema = z.object({
  valor: z.number().describe("Valor a converter"),
  moedaOrigem: z.string().min(1).describe("Moeda de origem (USD BRL EUR)"),
  moedaDestino: z.string().min(1).describe("Moeda de destino (USD BRL EUR)"),
});

server.tool(
  "converter",
  converterSchema.shape,
  {
    title: "Converte valor de uma moeda para outra",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true
  },
  async (args) => {
    try {
      // OpenAI Guideline: Validação de entrada
      const validated = converterSchema.parse(args);
      
      // TODO: Implementar lógica da tool aqui
      // OpenAI Guideline: Performance < 100ms quando possível
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(validated, null, 2)
          }
        ]
      };
    } catch (error) {
      // OpenAI Guideline: Tratamento de erros apropriado
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Erro ao executar converter: ${errorMessage}`);
    }
  }
);


// Iniciar servidor
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // OpenAI Guideline: Logging apropriado
  console.error("MCP Server rodando via stdio");
  console.error("Seguindo OpenAI Apps SDK Guidelines");
}

main().catch((error) => {
  console.error("Erro fatal:", error);
  process.exit(1);
});
