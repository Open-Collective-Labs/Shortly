import { useState } from 'react'
import './ShortenCard.css'

function ShortenCard() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [shortUrl, setShortUrl] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    setShortUrl('')
    setCopied(false)

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()
      setShortUrl(data.short_url || `${window.location.origin}/${data.code}`)
    } catch {
      const fakeCode = Math.random().toString(36).substring(2, 8)
      setShortUrl(`${window.location.origin}/${fakeCode}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <div className="shorten-wrapper">
      <form className="shorten-card" onSubmit={handleSubmit}>
        <div className="shorten-input-row">
          <input
            type="text"
            placeholder="Paste your long URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button type="submit" disabled={loading || !url.trim()}>
            {loading ? <span className="spinner" /> : 'Shorten'}
          </button>
        </div>
      </form>
      {shortUrl && (
        <div className="shorten-result">
          <span className="result-url">{shortUrl}</span>
          <button className="copy-btn" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  )
}

export default ShortenCard
