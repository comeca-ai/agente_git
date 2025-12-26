#!/usr/bin/env node
/**
 * FastMCP App Builder - Node.js + Inquirer
 * Modo fácil: descreva seu app naturalmente
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('✅ Builder carregado com sucesso!');
console.log('📦 Testando imports...\n');

const test = await inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: chalk.cyan('Digite seu nome para testar:')
  }
]);

console.log(boxen(
  chalk.green(`Olá, ${test.name}! 🎉\n\nInquirer funcionando!`),
  { padding: 1, borderStyle: 'round' }
));

console.log(chalk.yellow('\n✅ Todos os imports OK!\n'));
console.log('Próximo passo: implementar o builder completo...');
