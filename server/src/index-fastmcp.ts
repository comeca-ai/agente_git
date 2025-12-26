/**
 * FastMCP Server - Bible Daily App
 * Servidor simples seguindo guidelines FastMCP
 * 1 tool = 1 intention (clear and focused)
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import {
  getAllBooks,
  getRandomVerse,
  getVerseFromBook,
  formatVerse,
} from "./bible-data.js";

// ============================================
// FASTMCP STYLE: Schemas Claros e Simples
// ============================================

// Tool 1: Obter versículo diário (sem parâmetros)
const ObterVersiculoDiarioSchema = z.object({});

// Tool 2: Obter versículo por livro (1 parâmetro claro)
const ObterVersiculoPorLivroSchema = z.object({
  livro: z
    .string()
    .describe("Nome do livro da Bíblia (ex: João, Salmos, Provérbios)"),
});

// Tool 3: Listar livros disponíveis (sem parâmetros)
const ListarLivrosDisponiveisSchema = z.object({});

// ============================================
// CRIAR SERVIDOR MCP
// ============================================

const server = new Server(
  {
    name: "biblia-diaria",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ============================================
// REGISTRAR TOOLS (FastMCP: 1 tool = 1 intention)
// ============================================

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "obter_versiculo_diario",
        description:
          "Obtém um versículo bíblico aleatório para inspiração diária",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "obter_versiculo_por_livro",
        description:
          "Obtém um versículo aleatório de um livro específico da Bíblia",
        inputSchema: {
          type: "object",
          properties: {
            livro: {
              type: "string",
              description:
                "Nome do livro da Bíblia (ex: João, Salmos, Provérbios)",
            },
          },
          required: ["livro"],
        },
      },
      {
        name: "listar_livros_disponiveis",
        description: "Lista todos os livros da Bíblia disponíveis",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
    ],
  };
});

// ============================================
// IMPLEMENTAR TOOLS (lógica clara e focada)
// ============================================

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // Tool 1: Versículo diário
      case "obter_versiculo_diario": {
        const verse = getRandomVerse();
        const formatted = formatVerse(verse);

        return {
          content: [
            {
              type: "text",
              text: formatted,
            },
          ],
        };
      }

      // Tool 2: Versículo por livro
      case "obter_versiculo_por_livro": {
        const validated = ObterVersiculoPorLivroSchema.parse(args);
        const verse = getVerseFromBook(validated.livro);

        if (!verse) {
          return {
            content: [
              {
                type: "text",
                text: `❌ Livro "${validated.livro}" não encontrado. Use o tool "listar_livros_disponiveis" para ver os livros disponíveis.`,
              },
            ],
            isError: true,
          };
        }

        const formatted = formatVerse(verse);
        return {
          content: [
            {
              type: "text",
              text: formatted,
            },
          ],
        };
      }

      // Tool 3: Listar livros
      case "listar_livros_disponiveis": {
        const books = getAllBooks();
        const bookList = books.map((book) => `• ${book}`).join("\n");

        return {
          content: [
            {
              type: "text",
              text: `📚 **Livros Disponíveis:**\n\n${bookList}\n\n💡 Use o tool "obter_versiculo_por_livro" com qualquer um desses nomes.`,
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: "text",
              text: `❌ Tool desconhecida: ${name}`,
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
          text: `❌ Erro ao executar tool: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
      isError: true,
    };
  }
});

// ============================================
// INICIAR SERVIDOR (STDIO para FastMCP)
// ============================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("✅ Bible Daily MCP Server running on stdio (FastMCP style)");
}

main().catch((error) => {
  console.error("❌ Server error:", error);
  process.exit(1);
});
