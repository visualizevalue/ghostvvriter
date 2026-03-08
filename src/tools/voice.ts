import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function resolveDataFile(filename: string): string {
  const candidates = [
    join(__dirname, '..', 'data', filename),
    join(__dirname, '..', '..', 'src', 'data', filename),
  ]
  for (const path of candidates) {
    try {
      readFileSync(path)
      return path
    } catch {}
  }
  return candidates[0]
}

export function registerVoiceTool(server: McpServer) {
  server.tool(
    'get_writing_profile',
    "Get Jack Butcher's complete writing profile — voice, rhetorical patterns, contrast frames, word-level mechanics, anti-patterns, and reference tweets. Use this to write in the VV voice or understand the style.",
    {},
    async () => {
      const path = resolveDataFile('writing-profile.md')
      const content = readFileSync(path, 'utf-8')
      return {
        content: [{ type: 'text' as const, text: content }],
      }
    }
  )
}
