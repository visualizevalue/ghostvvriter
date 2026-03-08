import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

const VV_API = 'https://api.vv.xyz'

type VVImage = {
  id: string
  cdn: string
  path: string
  type: string
}

type VVVisual = {
  id: string
  schema: string
  data: {
    text?: string
    image: VVImage
    tags?: string[]
  }
  publishedAt: string
}

function imageUrl(img: VVImage): string {
  return `https://${img.cdn}.cdn.vv.xyz/${img.path}/${img.id}.${img.type}`
}

export function registerVisualTools(server: McpServer) {
  server.tool(
    'get_daily_visual',
    "Get today's VV visual — the daily illustration from the Visualize Value library",
    {},
    async () => {
      try {
        const res = await fetch(`${VV_API}/visuals/daily`)
        if (!res.ok) throw new Error(`API returned ${res.status}`)
        const data = await res.json()
        const visual = data.post as VVVisual
        const url = imageUrl(visual.data.image)

        return {
          content: [
            {
              type: 'text' as const,
              text: `Daily VV Visual:\n\n${visual.data.text ? `"${visual.data.text}"` : '(no text)'}\n\nImage: ${url}\nPublished: ${visual.publishedAt}`,
            },
          ],
        }
      } catch (e) {
        return {
          content: [{ type: 'text' as const, text: `Failed to fetch daily visual: ${e}` }],
        }
      }
    }
  )

  server.tool(
    'search_visuals',
    'Search VV visuals by text content. Returns matching visuals with image URLs.',
    {
      query: z.string().describe('Search term to match against visual text'),
      limit: z.number().optional().describe('Max results (default: 10)'),
    },
    async ({ query, limit = 10 }) => {
      try {
        const res = await fetch(`${VV_API}/visuals/all`)
        if (!res.ok) throw new Error(`API returned ${res.status}`)
        const visuals: VVVisual[] = await res.json()

        const q = query.toLowerCase()
        const matches = visuals
          .filter((v) => {
            const text = v.data.text?.toLowerCase() ?? ''
            const tags = v.data.tags?.join(' ').toLowerCase() ?? ''
            return text.includes(q) || tags.includes(q)
          })
          .slice(0, limit)

        if (matches.length === 0) {
          return {
            content: [{ type: 'text' as const, text: `No visuals found matching "${query}".` }],
          }
        }

        const formatted = matches
          .map((v) => {
            const url = imageUrl(v.data.image)
            return `${v.data.text ? `"${v.data.text}"` : '(no text)'}\nImage: ${url}`
          })
          .join('\n\n')

        return {
          content: [
            {
              type: 'text' as const,
              text: `Found ${matches.length} visuals matching "${query}":\n\n${formatted}`,
            },
          ],
        }
      } catch (e) {
        return {
          content: [{ type: 'text' as const, text: `Failed to search visuals: ${e}` }],
        }
      }
    }
  )

  server.tool(
    'get_visual',
    'Get a specific VV visual by ID',
    {
      id: z.string().describe('Visual ID'),
    },
    async ({ id }) => {
      try {
        const res = await fetch(`${VV_API}/visuals/${id}`)
        if (!res.ok) throw new Error(`API returned ${res.status}`)
        const visual: VVVisual = await res.json()
        const url = imageUrl(visual.data.image)

        return {
          content: [
            {
              type: 'text' as const,
              text: `VV Visual ${id}:\n\n${visual.data.text ? `"${visual.data.text}"` : '(no text)'}\n\nImage: ${url}\nPublished: ${visual.publishedAt}`,
            },
          ],
        }
      } catch (e) {
        return {
          content: [{ type: 'text' as const, text: `Failed to fetch visual: ${e}` }],
        }
      }
    }
  )
}
