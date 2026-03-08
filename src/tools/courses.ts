import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

type Course = {
  title: string
  tagline: string
  enrollment: string
  modules: { title: string; lessons: string[] }[]
}

let coursesCache: Record<string, Course> | null = null

function loadCourses(): Record<string, Course> {
  if (coursesCache) return coursesCache
  const candidates = [
    join(__dirname, '..', 'data', 'courses.json'),
    join(__dirname, '..', '..', 'src', 'data', 'courses.json'),
  ]
  for (const path of candidates) {
    try {
      const raw = readFileSync(path, 'utf-8')
      coursesCache = JSON.parse(raw)
      return coursesCache!
    } catch {}
  }
  return {}
}

const COURSE_KEYS = [
  'the-permissionless-apprentice',
  'build-once-sell-twice',
  'how-to-visualize-value',
] as const

export function registerCourseTools(server: McpServer) {
  server.tool(
    'list_courses',
    'List all available VV courses with titles, taglines, and enrollment numbers',
    {},
    async () => {
      const courses = loadCourses()
      const list = Object.entries(courses)
        .map(([key, c]) => `**${c.title}** (${key})\n${c.tagline}\nEnrollment: ${c.enrollment}`)
        .join('\n\n')

      return {
        content: [{ type: 'text' as const, text: `VV Courses:\n\n${list}` }],
      }
    }
  )

  server.tool(
    'get_course',
    'Get the full curriculum for a VV course — all modules and lessons',
    {
      course: z.enum(COURSE_KEYS).describe('Course identifier'),
    },
    async ({ course }) => {
      const courses = loadCourses()
      const c = courses[course]
      if (!c) {
        return { content: [{ type: 'text' as const, text: `Course "${course}" not found.` }] }
      }

      const modules = c.modules
        .map(
          (m, i) =>
            `### Module ${i + 1}: ${m.title}\n${m.lessons.map((l, j) => `  ${j + 1}. ${l}`).join('\n')}`
        )
        .join('\n\n')

      return {
        content: [
          {
            type: 'text' as const,
            text: `# ${c.title}\n\n${c.tagline}\n\nEnrollment: ${c.enrollment}\n\n${modules}`,
          },
        ],
      }
    }
  )
}
