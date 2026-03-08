import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { registerFrameworkTools } from './frameworks.js'
import { registerVoiceTool } from './voice.js'
import { registerTweetTools } from './tweets.js'
import { registerCourseTools } from './courses.js'
import { registerVisualTools } from './visuals.js'

export function registerTools(server: McpServer) {
  registerFrameworkTools(server)
  registerVoiceTool(server)
  registerTweetTools(server)
  registerCourseTools(server)
  registerVisualTools(server)
}
