/**
 * OpenAI Apps SDK Compliance Validator
 * Valida se o app segue as guidelines oficiais da OpenAI
 * https://developers.openai.com/apps-sdk/app-submission-guidelines
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface ComplianceResult {
  passed: boolean;
  category: string;
  checks: Array<{
    name: string;
    passed: boolean;
    message: string;
  }>;
}

export class OpenAIComplianceValidator {
  private appPath: string;

  constructor(appPath: string) {
    this.appPath = appPath;
  }

  /**
   * Valida todas as guidelines da OpenAI
   */
  async validateAll(): Promise<ComplianceResult[]> {
    const results: ComplianceResult[] = [];

    results.push(await this.validateToolDesign());
    results.push(await this.validateSecurity());
    results.push(await this.validatePrivacy());
    results.push(await this.validateAnnotations());
    results.push(await this.validateDocumentation());
    results.push(await this.validatePerformance());

    return results;
  }

  /**
   * 1. Tool Design (FastMCP Style)
   * - 1 tool = 1 intention
   * - Nomes claros e descritivos
   * - Schemas explícitos
   */
  private async validateToolDesign(): Promise<ComplianceResult> {
    const checks = [];
    
    const serverFile = join(this.appPath, 'server/src/index.ts');
    if (!existsSync(serverFile)) {
      return {
        passed: false,
        category: 'Tool Design',
        checks: [{ name: 'Server File', passed: false, message: 'index.ts not found' }]
      };
    }

    const content = readFileSync(serverFile, 'utf-8');

    // Check 1: Tool count (1-3 recommended)
    const toolMatches = content.match(/case\s+"[^"]+"\s*:/g) || [];
    const toolCount = toolMatches.length;
    checks.push({
      name: 'Tool Count',
      passed: toolCount >= 1 && toolCount <= 3,
      message: `Found ${toolCount} tools (recommended: 1-3)`
    });

    // Check 2: Schemas explícitos (Zod)
    const hasZodSchemas = content.includes('z.object');
    checks.push({
      name: 'Explicit Schemas',
      passed: hasZodSchemas,
      message: hasZodSchemas ? 'Zod schemas found' : 'No Zod schemas found'
    });

    // Check 3: Nomes claros (snake_case)
    const toolNames = content.match(/name:\s*"([^"]+)"/g) || [];
    const hasGoodNames = toolNames.some(name => name.includes('_'));
    checks.push({
      name: 'Clear Names',
      passed: hasGoodNames || toolCount === 0,
      message: hasGoodNames ? 'Tools use descriptive names' : 'Consider using verb_object pattern'
    });

    // Check 4: Descrições claras
    const hasDescriptions = content.includes('description:');
    checks.push({
      name: 'Tool Descriptions',
      passed: hasDescriptions,
      message: hasDescriptions ? 'Tools have descriptions' : 'Add descriptions to tools'
    });

    return {
      passed: checks.every(c => c.passed),
      category: '1. Tool Design (FastMCP)',
      checks
    };
  }

  /**
   * 2. Security Guidelines
   * - No API keys in responses
   * - Server-side validation
   * - Input sanitization
   */
  private async validateSecurity(): Promise<ComplianceResult> {
    const checks = [];
    
    const serverFile = join(this.appPath, 'server/src/index.ts');
    const content = existsSync(serverFile) ? readFileSync(serverFile, 'utf-8') : '';

    // Check 1: Schema validation
    const hasValidation = content.includes('.parse(args)') || content.includes('.safeParse');
    checks.push({
      name: 'Input Validation',
      passed: hasValidation,
      message: hasValidation ? 'Input validation implemented' : 'Add Zod validation'
    });

    // Check 2: Error handling
    const hasErrorHandling = content.includes('try') && content.includes('catch');
    checks.push({
      name: 'Error Handling',
      passed: hasErrorHandling,
      message: hasErrorHandling ? 'Error handling present' : 'Add try-catch blocks'
    });

    // Check 3: No hardcoded secrets (basic check)
    const suspiciousPatterns = /api[_-]?key|secret|password|token/i;
    const hasSecrets = content.match(new RegExp(`["']\\w*${suspiciousPatterns.source}["']\\s*:\\s*["']\\w+["']`, 'i'));
    checks.push({
      name: 'No Hardcoded Secrets',
      passed: !hasSecrets,
      message: hasSecrets ? 'Possible hardcoded secrets found' : 'No hardcoded secrets detected'
    });

    // Check 4: isError flag usage
    const hasErrorFlag = content.includes('isError: true');
    checks.push({
      name: 'Error Flag Usage',
      passed: hasErrorFlag,
      message: hasErrorFlag ? 'Uses isError flag correctly' : 'Add isError flag to error responses'
    });

    return {
      passed: checks.every(c => c.passed),
      category: '2. Security',
      checks
    };
  }

  /**
   * 3. Privacy & Data Handling
   * - No PII collection
   * - Minimal data exposure
   * - Clear data handling
   */
  private async validatePrivacy(): Promise<ComplianceResult> {
    const checks = [];

    const readmeFile = join(this.appPath, 'README.md');
    const hasReadme = existsSync(readmeFile);
    const readmeContent = hasReadme ? readFileSync(readmeFile, 'utf-8') : '';

    // Check 1: README exists
    checks.push({
      name: 'README Exists',
      passed: hasReadme,
      message: hasReadme ? 'README.md found' : 'Create README.md'
    });

    // Check 2: Privacy statement
    const hasPrivacy = readmeContent.toLowerCase().includes('privacy') || 
                       readmeContent.toLowerCase().includes('data');
    checks.push({
      name: 'Privacy Statement',
      passed: hasPrivacy,
      message: hasPrivacy ? 'Privacy information present' : 'Add privacy statement to README'
    });

    // Check 3: No PII mention
    const serverFile = join(this.appPath, 'server/src/index.ts');
    const serverContent = existsSync(serverFile) ? readFileSync(serverFile, 'utf-8') : '';
    const piiPatterns = /email|phone|address|ssn|credit.*card/i;
    const collectsPII = piiPatterns.test(serverContent);
    checks.push({
      name: 'No PII Collection',
      passed: !collectsPII,
      message: collectsPII ? 'Possible PII collection detected' : 'No PII collection detected'
    });

    return {
      passed: checks.filter(c => c.name !== 'Privacy Statement').every(c => c.passed),
      category: '3. Privacy & Data',
      checks
    };
  }

  /**
   * 4. Annotations (Required for Apps SDK)
   * - readOnlyHint for read-only tools
   * - Proper tool descriptions
   */
  private async validateAnnotations(): Promise<ComplianceResult> {
    const checks = [];

    const serverFile = join(this.appPath, 'server/src/index.ts');
    const content = existsSync(serverFile) ? readFileSync(serverFile, 'utf-8') : '';

    // Check 1: Tool descriptions
    const toolDescriptions = content.match(/description:\s*"[^"]+"/g) || [];
    checks.push({
      name: 'Tool Descriptions',
      passed: toolDescriptions.length > 0,
      message: `${toolDescriptions.length} tool descriptions found`
    });

    // Check 2: Input schemas defined
    const hasInputSchema = content.includes('inputSchema');
    checks.push({
      name: 'Input Schemas',
      passed: hasInputSchema,
      message: hasInputSchema ? 'Input schemas defined' : 'Define input schemas'
    });

    // Note: readOnlyHint is optional but recommended
    const hasReadOnlyHint = content.includes('readOnlyHint');
    checks.push({
      name: 'ReadOnly Hints (Optional)',
      passed: true, // Optional
      message: hasReadOnlyHint ? 'ReadOnly hints present' : 'Consider adding readOnlyHint for read-only tools'
    });

    return {
      passed: checks.filter(c => !c.name.includes('Optional')).every(c => c.passed),
      category: '4. Annotations',
      checks
    };
  }

  /**
   * 5. Documentation
   * - README with clear description
   * - Usage examples
   * - Setup instructions
   */
  private async validateDocumentation(): Promise<ComplianceResult> {
    const checks = [];

    const readmeFile = join(this.appPath, 'README.md');
    const hasReadme = existsSync(readmeFile);
    const content = hasReadme ? readFileSync(readmeFile, 'utf-8') : '';

    checks.push({
      name: 'README Exists',
      passed: hasReadme,
      message: hasReadme ? 'README.md found' : 'Create README.md'
    });

    if (hasReadme) {
      const hasDescription = content.length > 100;
      checks.push({
        name: 'Description',
        passed: hasDescription,
        message: hasDescription ? 'Has description' : 'Add detailed description'
      });

      const hasUsage = content.toLowerCase().includes('usage') || 
                       content.toLowerCase().includes('how to') ||
                       content.toLowerCase().includes('quick start');
      checks.push({
        name: 'Usage Instructions',
        passed: hasUsage,
        message: hasUsage ? 'Usage instructions present' : 'Add usage instructions'
      });

      const hasTools = content.toLowerCase().includes('tool');
      checks.push({
        name: 'Tools Documentation',
        passed: hasTools,
        message: hasTools ? 'Tools documented' : 'Document available tools'
      });
    }

    return {
      passed: checks.every(c => c.passed),
      category: '5. Documentation',
      checks
    };
  }

  /**
   * 6. Performance & Reliability
   * - Error handling
   * - Response times
   * - Edge cases
   */
  private async validatePerformance(): Promise<ComplianceResult> {
    const checks = [];

    const serverFile = join(this.appPath, 'server/src/index.ts');
    const content = existsSync(serverFile) ? readFileSync(serverFile, 'utf-8') : '';

    // Check 1: Async/await usage
    const hasAsync = content.includes('async') && content.includes('await');
    checks.push({
      name: 'Async Operations',
      passed: hasAsync,
      message: hasAsync ? 'Uses async/await' : 'Consider async operations'
    });

    // Check 2: Error handling
    const hasTryCatch = content.includes('try') && content.includes('catch');
    checks.push({
      name: 'Error Handling',
      passed: hasTryCatch,
      message: hasTryCatch ? 'Has try-catch blocks' : 'Add error handling'
    });

    // Check 3: Default case in switch
    const hasDefault = content.includes('default:');
    checks.push({
      name: 'Default Case',
      passed: hasDefault,
      message: hasDefault ? 'Has default case' : 'Add default case to switch'
    });

    return {
      passed: checks.every(c => c.passed),
      category: '6. Performance',
      checks
    };
  }

  /**
   * Gera relatório de compliance
   */
  generateReport(results: ComplianceResult[]): string {
    let report = '\n';
    report += '╔══════════════════════════════════════════════════════════╗\n';
    report += '║     OpenAI Apps SDK Compliance Report                   ║\n';
    report += '╚══════════════════════════════════════════════════════════╝\n\n';

    const allPassed = results.every(r => r.passed);
    const totalChecks = results.reduce((sum, r) => sum + r.checks.length, 0);
    const passedChecks = results.reduce((sum, r) => sum + r.checks.filter(c => c.passed).length, 0);

    for (const result of results) {
      const icon = result.passed ? '✅' : '⚠️';
      report += `${icon} ${result.category}\n`;
      
      for (const check of result.checks) {
        const checkIcon = check.passed ? '  ✓' : '  ✗';
        report += `${checkIcon} ${check.name}: ${check.message}\n`;
      }
      report += '\n';
    }

    report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    report += `Overall: ${passedChecks}/${totalChecks} checks passed\n`;
    
    if (allPassed) {
      report += '\n✅ READY FOR SUBMISSION!\n';
      report += 'Your app follows OpenAI Apps SDK guidelines.\n';
    } else {
      report += '\n⚠️  Some improvements recommended\n';
      report += 'Review the items marked with ✗ above.\n';
    }

    return report;
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const appPath = process.argv[2] || process.cwd();
  const validator = new OpenAIComplianceValidator(appPath);
  
  validator.validateAll().then(results => {
    const report = validator.generateReport(results);
    console.log(report);
    
    const allPassed = results.every(r => r.passed);
    process.exit(allPassed ? 0 : 1);
  });
}
