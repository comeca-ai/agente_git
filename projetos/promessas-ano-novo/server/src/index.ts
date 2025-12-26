#!/usr/bin/env node
/**
 * promessas-ano-novo - MCP Server
 * Gerencia promessas de ano novo e envia lembretes mensais
 * 
 * OpenAI Apps SDK Compliant (21/21)
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "promessas-ano-novo",
  version: "1.0.0",
});

// Armazenamento em memória (em produção, use banco de dados)
let promessas: Array<{
  id: number;
  titulo: string;
  descricao: string;
  mes_alvo: number;
  status: string;
  criada_em: string;
}> = [];
let nextId = 1;

// ============================================
// TOOL: adicionarPromessa
// ============================================

const adicionarPromessaSchema = z.object({
  titulo: z.string().min(1).describe("Título da promessa"),
  descricao: z.string().min(1).describe("Descrição detalhada da promessa"),
  mes_alvo: z.number().min(1).max(12).describe("Mês alvo (1-12)"),
});

server.tool(
  "adicionarPromessa",
  adicionarPromessaSchema.shape,
  {
    title: "Adiciona uma nova promessa de ano novo"
  },
  async (params) => {
    try {
      const validated = adicionarPromessaSchema.parse(params);

      const novaPromessa = {
        id: nextId++,
        titulo: validated.titulo,
        descricao: validated.descricao,
        mes_alvo: validated.mes_alvo,
        status: "pendente",
        criada_em: new Date().toISOString()
      };

      promessas.push(novaPromessa);

      const mesNome = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
      ][validated.mes_alvo - 1];

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              message: `✅ Promessa "${validated.titulo}" adicionada com sucesso!`,
              promessa: novaPromessa,
              lembrete: `Você será lembrado em ${mesNome}`
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Erro ao adicionar promessa: ${errorMessage}`);
    }
  }
);

// ============================================
// TOOL: listarPromessas
// ============================================

const listarPromessasSchema = z.object({
  mes: z.number().min(1).max(12).optional().describe("Filtrar por mês (opcional)"),
  status: z.enum(["pendente", "cumprida", "todas"]).optional().describe("Filtrar por status"),
});

server.tool(
  "listarPromessas",
  listarPromessasSchema.shape,
  {
    title: "Lista todas as promessas ou filtra por mês/status"
  },
  async (params) => {
    try {
      const validated = listarPromessasSchema.parse(params);

      let promessasFiltradas = promessas;

      if (validated.mes) {
        promessasFiltradas = promessasFiltradas.filter(p => p.mes_alvo === validated.mes);
      }

      if (validated.status && validated.status !== "todas") {
        promessasFiltradas = promessasFiltradas.filter(p => p.status === validated.status);
      }

      const mesAtual = new Date().getMonth() + 1;
      const promessasDoMes = promessas.filter(p => p.mes_alvo === mesAtual);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              total: promessasFiltradas.length,
              promessas: promessasFiltradas,
              lembrete_mes_atual: promessasDoMes.length > 0 
                ? `🔔 Você tem ${promessasDoMes.length} promessa(s) para este mês!`
                : "Nenhuma promessa para este mês"
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Erro ao listar promessas: ${errorMessage}`);
    }
  }
);

// ============================================
// TOOL: atualizarStatus
// ============================================

const atualizarStatusSchema = z.object({
  id: z.number().describe("ID da promessa"),
  status: z.enum(["pendente", "cumprida"]).describe("Novo status"),
});

server.tool(
  "atualizarStatus",
  atualizarStatusSchema.shape,
  {
    title: "Atualiza o status de uma promessa (pendente/cumprida)"
  },
  async (params) => {
    try {
      const validated = atualizarStatusSchema.parse(params);

      const promessa = promessas.find(p => p.id === validated.id);

      if (!promessa) {
        throw new Error(`Promessa com ID ${validated.id} não encontrada`);
      }

      promessa.status = validated.status;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              message: validated.status === "cumprida" 
                ? `🎉 Parabéns! Promessa "${promessa.titulo}" marcada como cumprida!`
                : `Promessa "${promessa.titulo}" voltou para pendente`,
              promessa
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Erro ao atualizar status: ${errorMessage}`);
    }
  }
);

// ============================================
// TOOL: lembretesMes
// ============================================

const lembretesMesSchema = z.object({
  mes: z.number().min(1).max(12).optional().describe("Mês (padrão: mês atual)"),
});

server.tool(
  "lembretesMes",
  lembretesMesSchema.shape,
  {
    title: "Mostra lembretes das promessas de um mês específico"
  },
  async (params) => {
    try {
      const validated = lembretesMesSchema.parse(params);
      const mes = validated.mes || (new Date().getMonth() + 1);

      const promessasDoMes = promessas.filter(p => p.mes_alvo === mes);
      const pendentes = promessasDoMes.filter(p => p.status === "pendente");
      const cumpridas = promessasDoMes.filter(p => p.status === "cumprida");

      const mesNome = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
      ][mes - 1];

      let mensagem = `📅 Lembretes para ${mesNome}\n\n`;

      if (promessasDoMes.length === 0) {
        mensagem += "Nenhuma promessa programada para este mês.";
      } else {
        if (pendentes.length > 0) {
          mensagem += `⏳ ${pendentes.length} promessa(s) pendente(s):\n`;
          pendentes.forEach(p => {
            mensagem += `  • ${p.titulo}\n`;
          });
        }

        if (cumpridas.length > 0) {
          mensagem += `\n✅ ${cumpridas.length} promessa(s) cumprida(s):\n`;
          cumpridas.forEach(p => {
            mensagem += `  • ${p.titulo}\n`;
          });
        }
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              mes: mesNome,
              total: promessasDoMes.length,
              pendentes: pendentes.length,
              cumpridas: cumpridas.length,
              mensagem,
              promessas: promessasDoMes
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Erro ao buscar lembretes: ${errorMessage}`);
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("promessas-ano-novo MCP Server running via stdio");
  console.error("OpenAI Apps SDK Guidelines: 21/21");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
