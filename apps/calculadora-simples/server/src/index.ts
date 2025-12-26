#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Criar servidor MCP
const server = new McpServer({
  name: "calculadora-simples",
  version: "1.0.0",
});

// Tool: calcular
const calcularSchema = z.object({
  numero1: z.number().describe("Primeiro número da operação"),
  numero2: z.number().describe("Segundo número da operação"),
  operacao: z.string().describe("Operação: add, subtract, multiply, divide"),
});

server.tool(
  "calcular",
  calcularSchema.shape,
  {
    title: "Calcula operações matemáticas (+, -, *, /)"
  },
  async (args) => {
    try {
      // TODO: Implementar lógica da tool
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(args, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new Error(`Erro ao executar calcular: ${error}`);
    }
  }
);


// Iniciar servidor
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server rodando via stdio");
}

main().catch((error) => {
  console.error("Erro fatal:", error);
  process.exit(1);
});
