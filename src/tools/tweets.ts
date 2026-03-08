import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

type Tweet = {
  id: string
  text: string
  date: string
  likes: number
  rts: number
}

let tweetsCache: Tweet[] | null = null

function loadTweets(): Tweet[] {
  if (tweetsCache) return tweetsCache
  const candidates = [
    join(__dirname, '..', 'data', 'tweet-index.json'),
    join(__dirname, '..', '..', 'src', 'data', 'tweet-index.json'),
  ]
  for (const path of candidates) {
    try {
      const raw = readFileSync(path, 'utf-8')
      tweetsCache = JSON.parse(raw)
      return tweetsCache!
    } catch {}
  }
  return []
}

export function registerTweetTools(server: McpServer) {
  server.tool(
    'search_tweets',
    "Search Jack Butcher's tweet archive by keyword. Returns matching tweets sorted by likes. Use min_likes to filter for top performers only.",
    {
      query: z.string().describe('Search term to match against tweet text'),
      min_likes: z.number().optional().describe('Minimum likes threshold (default: 0)'),
      limit: z.number().optional().describe('Max results to return (default: 20)'),
    },
    async ({ query, min_likes = 0, limit = 20 }) => {
      const tweets = loadTweets()
      const q = query.toLowerCase()
      const matches = tweets
        .filter((t) => t.text.toLowerCase().includes(q) && t.likes >= min_likes)
        .sort((a, b) => b.likes - a.likes)
        .slice(0, limit)

      if (matches.length === 0) {
        return {
          content: [{ type: 'text' as const, text: `No tweets found matching "${query}" with ${min_likes}+ likes.` }],
        }
      }

      const formatted = matches
        .map((t) => `"${t.text}"\n  — ${t.likes.toLocaleString()} likes, ${t.rts.toLocaleString()} RTs (${t.date})`)
        .join('\n\n')

      return {
        content: [
          {
            type: 'text' as const,
            text: `Found ${matches.length} tweets matching "${query}":\n\n${formatted}`,
          },
        ],
      }
    }
  )

  server.tool(
    'top_tweets',
    "Get Jack Butcher's top-performing tweets by likes. Great for understanding what resonates most.",
    {
      limit: z.number().optional().describe('Number of tweets to return (default: 25)'),
    },
    async ({ limit = 25 }) => {
      const tweets = loadTweets()
      const top = tweets.sort((a, b) => b.likes - a.likes).slice(0, limit)

      const formatted = top
        .map(
          (t, i) =>
            `${i + 1}. "${t.text}"\n   ${t.likes.toLocaleString()} likes, ${t.rts.toLocaleString()} RTs`
        )
        .join('\n\n')

      return {
        content: [{ type: 'text' as const, text: `Top ${limit} tweets:\n\n${formatted}` }],
      }
    }
  )
}
