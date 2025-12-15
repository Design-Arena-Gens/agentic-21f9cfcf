'use client'

import { useState } from 'react'
import styles from './page.module.css'

interface GeneratedContent {
  research: string
  hook: string
  script: string
  endingTwist: string
  soraPrompt: string
}

export default function Home() {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState<GeneratedContent | null>(null)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic')
      return
    }

    setLoading(true)
    setError('')
    setContent(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate content')
      }

      const data = await response.json()
      setContent(data)
    } catch (err) {
      setError('Failed to generate content. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>YouTube Shorts Automation Agent</h1>
        <p className={styles.subtitle}>
          Generate viral scripts and Sora 2 prompts for faceless YouTube Shorts
        </p>

        <div className={styles.inputSection}>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your topic (e.g., 'Ancient Egypt mysteries')"
            className={styles.input}
            onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={styles.button}
          >
            {loading ? 'Generating...' : 'Generate Content'}
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {content && (
          <div className={styles.results}>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Research & Angle</h2>
                <button
                  onClick={() => copyToClipboard(content.research)}
                  className={styles.copyBtn}
                >
                  Copy
                </button>
              </div>
              <div className={styles.content}>{content.research}</div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Script</h2>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `HOOK:\n${content.hook}\n\nSCRIPT:\n${content.script}\n\nENDING TWIST:\n${content.endingTwist}`
                    )
                  }
                  className={styles.copyBtn}
                >
                  Copy All
                </button>
              </div>
              <div className={styles.scriptSection}>
                <h3>HOOK:</h3>
                <div className={styles.content}>{content.hook}</div>
                <h3>SCRIPT:</h3>
                <div className={styles.content}>{content.script}</div>
                <h3>ENDING TWIST:</h3>
                <div className={styles.content}>{content.endingTwist}</div>
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Sora 2 Video Prompt</h2>
                <button
                  onClick={() => copyToClipboard(content.soraPrompt)}
                  className={styles.copyBtn}
                >
                  Copy
                </button>
              </div>
              <div className={styles.content}>{content.soraPrompt}</div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
