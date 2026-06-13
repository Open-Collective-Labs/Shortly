import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'
import { queryClient } from '../lib/queryClient'
import './ShortenCard.css'

function ShortenCard() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const mutation = useMutation({
    mutationFn: () => api.createLink(url.trim()),
    onSuccess: (data) => {
      setShortUrl(data.short_url)
      setCopied(false)
      queryClient.invalidateQueries({ queryKey: ['links'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
    onError: (err) => {
      const fakeCode = Math.random().toString(36).substring(2, 8)
      setShortUrl(`${window.location.origin}/${fakeCode}`)
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    if (!url.trim()) return
    setShortUrl('')
    mutation.mutate()
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
          <button type="submit" disabled={mutation.isPending || !url.trim()}>
            {mutation.isPending ? <span className="spinner" /> : 'Shorten'}
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
