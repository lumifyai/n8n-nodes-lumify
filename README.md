# n8n-nodes-lumify

This is an n8n community node for [Lumify](https://lumify.ai) - AI-powered search and research APIs.

Lumify provides two powerful capabilities:
- **Search**: AI-powered search across your indexed website content
- **Last 30 Days**: Research-grade trend analysis from social media and web discussions

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### In n8n Desktop/Cloud

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-lumify`
4. Agree to the risks and select **Install**

### Self-hosted n8n

```bash
npm install n8n-nodes-lumify
```

## Prerequisites

- A [Lumify account](https://www.lumify.ai/beta-signup) (free to sign up)
- Your API Key from the [Lumify Dashboard](https://www.lumify.ai/app/api-keys)
- For Search: An Application ID from your dashboard

## Operations

### Search

Query your indexed website content and get AI-generated answers with source citations.

**Required:**
- API Key
- Application ID
- Query (the search question)

**Options:**
- **Answer Mode**: Cache high-confidence answers for faster responses (default: true)
- **Similar Questions**: Return related questions from your knowledge base (default: false)

**Response includes:**
- AI-generated answer
- Source URLs with titles and relevance scores
- Confidence score (0.0 - 1.0)
- Similar questions (if enabled)
- Call-to-action links (when intent is detected)

### Last 30 Days

Research trends and synthesize discussions from Twitter/X, Reddit, and web sources into actionable intelligence.

**Required:**
- API Key
- Topic (the subject to research, max 200 characters)

**Options:**
- **Sources**: Data sources to query - Twitter/X, Reddit, Web (default: all three)
- **Days**: Number of days to look back, 1-30 (default: 30)
- **Max Results**: Maximum evidence items per source, 5-50 (default: 20)
- **Output Format**: 
  - `summary` - Markdown-formatted narrative (default)
  - `bullets` - Structured bullet points
  - `json` - Fully structured data

**Response includes:**
- Synthesized research brief with patterns, insights, and gotchas
- Evidence count and source breakdown
- Confidence score
- Execution metadata (time, tokens used)

## Credentials

### Setting up Lumify Credentials

1. [Sign up for Lumify](https://www.lumify.ai/beta-signup) if you haven't already
2. Go to your [API Keys page](https://www.lumify.ai/app/api-keys)
3. Copy your **API Key** (format: `lmfy-xxxxx`)
4. If using Search, copy your **Application ID** from the dashboard

In n8n:
1. Go to **Credentials**
2. Select **New Credential**
3. Search for **Lumify API**
4. Enter your API Key (required)
5. Enter your Application ID (required for Search, optional for Last 30 Days)

## Example Workflows

### AI-Powered FAQ Bot

1. **Trigger**: Webhook receives a user question
2. **Lumify Search**: Query your knowledge base
3. **IF**: Check confidence score
4. **Respond**: Return answer or escalate to human

### Weekly Trend Report

1. **Schedule Trigger**: Every Monday at 9am
2. **Lumify Last 30 Days**: Research your industry topic
3. **Slack/Email**: Send the synthesized brief to your team

### Content Research Pipeline

1. **Form Trigger**: Content team submits a topic
2. **Lumify Last 30 Days**: Research current discussions
3. **Google Docs**: Create a research document
4. **Notify**: Alert the team it's ready

## Resources

- [Lumify Documentation](https://docs.lumify.ai)
- [Search API Reference](https://docs.lumify.ai/search-api)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## Support

- For Lumify issues: [Contact Lumify Support](https://www.lumify.ai/contact-us)
- For node issues: [Open an issue](https://github.com/lumifyai/n8n-nodes-lumify/issues)

## License

[MIT](LICENSE)
