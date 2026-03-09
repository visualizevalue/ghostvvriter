# ghostvvriter

Content creation engine for [Visualize Value](https://visualizevalue.com). An MCP server that generates articles, drafts tweets, and creates visual concepts from Jack Butcher's archive.

No searching. No setup. Connect it and say "write me an article."

## Install

```bash
npx ghostvvriter
```

### Claude Code

```bash
claude mcp add ghostvvriter -- npx ghostvvriter
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ghostvvriter": {
      "command": "npx",
      "args": ["ghostvvriter"]
    }
  }
}
```

## Tools

### Create

| Tool | What it does |
|------|-------------|
| `suggest_article` | Surfaces article ideas from the tweet archive and visual library. No input needed — every call shuffles the sample. |
| `generate_article` | Writes the article from selected tweets and visuals. Output is publish-ready HTML with embedded tweets and images. |
| `draft_tweet` | Drafts tweets in the VV voice. Optional topic. |
| `visual_ideas` | Generates concepts for new VV-style illustrations. Optional theme. |
| `apply_framework` | Applies a VV framework (productization spectrum, shu-ha-ri, time ladder, etc.) to any situation. |

### Reference

| Tool | What it does |
|------|-------------|
| `get_writing_profile` | Jack Butcher's complete writing profile — voice, patterns, mechanics. |
| `search_tweets` | Search the tweet archive by keyword. |
| `top_tweets` | Top-performing tweets by likes. |
| `search_visuals` | Search the visual library by text, tags, or description. |
| `get_visual` | Get a specific visual by ID. |
| `get_daily_visual` | Today's VV visual. |
| `list_frameworks` | List all VV frameworks. |
| `get_framework` | Get a specific framework. |
| `list_courses` | List all VV courses (all free). |
| `get_course` | Get a course curriculum. |
| `get_lesson` | Get full lesson content by title. |
| `search_lessons` | Search across all lesson content. |
| `list_projects` | List all VV art projects. |
| `get_project` | Get project details. |
| `search_projects` | Search projects by keyword. |

## How it works

The archive is the fuel, not the product. `suggest_article` loads a randomized sample of ~250 tweets (top performers, mid-tier, deep cuts) alongside ~150 VV visuals, and the AI finds the interesting idea clusters. Every call shuffles the sample, so you never get the same suggestions twice.

The creation tools require no input by default. The archive surfaces the ideas — you don't need to know what to look for.

## Built by

[Visualize Value](https://visualizevalue.com) · [Jack Butcher](https://x.com/jackbutcher)

## License

MIT
