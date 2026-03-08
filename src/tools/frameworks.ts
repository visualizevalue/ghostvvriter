import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const frameworksDir = join(__dirname, '..', 'data', 'frameworks')

// Also works from dist/
function resolveFrameworksDir(): string {
  // Try src/data first (dev), then fall back to relative from dist/
  const candidates = [
    join(__dirname, '..', 'data', 'frameworks'),
    join(__dirname, '..', '..', 'src', 'data', 'frameworks'),
  ]
  for (const dir of candidates) {
    try {
      readdirSync(dir)
      return dir
    } catch {}
  }
  return candidates[0]
}

const FRAMEWORKS: Record<string, string> = {
  'productization-spectrum': 'productization-spectrum.md',
  'shuhari': 'shuhari.md',
  'time-ladder': 'time-ladder.md',
  'train': 'train.md',
  'permissionless-apprentice': 'permissionless-apprentice.md',
  'proof-price-loop': 'proof-price-loop.md',
}

export function registerFrameworkTools(server: McpServer) {
  server.tool(
    'list_frameworks',
    'List all available VV frameworks and mental models',
    {},
    async () => {
      const names = Object.keys(FRAMEWORKS)
      return {
        content: [
          {
            type: 'text' as const,
            text: `Available VV frameworks:\n\n${names.map((n) => `- ${n}`).join('\n')}\n\nUse get_framework with any of these names to get the full framework.`,
          },
        ],
      }
    }
  )

  server.tool(
    'get_framework',
    'Get a specific VV framework or mental model. Returns the full framework with explanation, steps, and key insights.',
    { name: z.enum(Object.keys(FRAMEWORKS) as [string, ...string[]]).describe('Framework name') },
    async ({ name }) => {
      const dir = resolveFrameworksDir()
      const file = FRAMEWORKS[name]
      const content = readFileSync(join(dir, file), 'utf-8')
      return {
        content: [{ type: 'text' as const, text: content }],
      }
    }
  )
}
