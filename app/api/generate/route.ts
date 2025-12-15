import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json()

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    const prompt = `You are a YouTube Shorts Automation Agent specializing in creating viral faceless content.

CHANNEL TYPE: Faceless YouTube Shorts
Style: cinematic, suspenseful, viral
Duration: 45-60 seconds
Aspect Ratio: 9:16
Audience: global (English)
Goal: maximum retention & viral potential

INPUT TOPIC: ${topic}

TASKS (DO ALL AUTOMATICALLY):

1. DEEP RESEARCH
- Research the topic deeply
- Find 1 shocking / curiosity-driven angle
- Ensure the fact sounds unbelievable but is real
- Avoid copyright issues

2. VIRAL SCRIPT (45-60s)
- Strong 0-3 second hook
- Simple, spoken English (TTS friendly)
- Short punchy sentences
- Build suspense every 5-7 seconds
- Powerful twist or question at the end
- NO emojis
- NO narrator name

3. SORA 2 VIDEO PROMPT
Generate a ready-to-paste Sora 2 prompt with:
- ultra-realistic cinematic visuals
- dramatic lighting
- slow camera motion
- intense mood
- scene-by-scene visual flow
- no text on screen
- no subtitles
- faceless characters only
Include: video duration, aspect ratio 9:16

Respond in JSON format with these keys:
{
  "research": "Your research findings and the shocking angle",
  "hook": "The 0-3 second hook",
  "script": "The main script body",
  "endingTwist": "The ending twist or question",
  "soraPrompt": "The complete Sora 2 video generation prompt"
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are a viral content creation expert specializing in YouTube Shorts. You create compelling, retention-focused scripts and detailed video prompts.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.9,
      max_tokens: 2500,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error('No content generated')
    }

    const result = JSON.parse(content)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error generating content:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}
