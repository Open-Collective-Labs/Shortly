import { useState } from 'react'
import { FiSearch, FiCopy, FiTrash2, FiExternalLink } from 'react-icons/fi'
import ConfirmModal from '../components/ConfirmModal'
import './MyLinks.css'

const PAGE_SIZE = 10

const MOCK_LINKS = [
  { id: '1', short: 'abc123', url: 'https://example.com/very/long/path/to/some/page', clicks: 142, created: '2026-06-10', status: 'active' },
  { id: '2', short: 'def456', url: 'https://docs.example.com/getting-started/installation', clicks: 87, created: '2026-06-09', status: 'active' },
  { id: '3', short: 'ghi789', url: 'https://blog.example.com/posts/why-url-shorteners-are-useful', clicks: 34, created: '2026-06-07', status: 'active' },
  { id: '4', short: 'jkl012', url: 'https://shop.example.com/products/12345?ref=newsletter&utm_source=email', clicks: 12, created: '2026-06-01', status: 'expired' },
  { id: '5', short: 'mno345', url: 'https://news.example.com/article/breaking-story', clicks: 201, created: '2026-05-28', status: 'active' },
  { id: '6', short: 'pqr678', url: 'https://help.example.com/support/ticket/9876', clicks: 56, created: '2026-05-20', status: 'expired' },
]

function MyLinks() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = MOCK_LINKS.filter(
    (link) =>
      link.url.toLowerCase().includes(search.toLowerCase()) ||
      link.short.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function goTo(p) {
    if (p >= 1 && p <= totalPages) setPage(p)
  }

  async function handleCopy(code) {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${code}`)
    } catch {
      // fallback
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">My Links</h2>
        <div className="search-bar">
          <FiSearch size={18} />
          <input
            type="text"
            placeholder="Search links..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="page-empty">No links found.</p>
      ) : (
        <>
          <div className="links-table">
            <div className="links-table-header">
              <span className="col-short">Short URL</span>
              <span className="col-url">Original URL</span>
              <span className="col-clicks">Clicks</span>
              <span className="col-created">Created</span>
              <span className="col-actions">Actions</span>
            </div>
            {paged.map((link) => (
              <div className="links-table-row" key={link.id}>
                <span className="col-short">
                  <span className={`status-dot ${link.status}`} />
                  <span className="short-code">/{link.short}</span>
                </span>
                <span className="col-url" title={link.url}>{link.url}</span>
                <span className="col-clicks">{link.clicks.toLocaleString()}</span>
                <span className="col-created">{link.created}</span>
                <span className="col-actions">
                  <button className="icon-btn" title="Copy" onClick={() => handleCopy(link.short)}>
                    <FiCopy size={16} />
                  </button>
                  <a href={`/${link.short}`} target="_blank" className="icon-btn" title="Open">
                    <FiExternalLink size={16} />
                  </a>
                  <button className="icon-btn icon-btn--danger" title="Delete" onClick={() => setDeleteTarget(link)}>
                    <FiTrash2 size={16} />
                  </button>
                </span>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button className="page-btn" disabled={page === 1} onClick={() => goTo(page - 1)}>Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={`page-btn ${p === page ? 'page-btn--active' : ''}`} onClick={() => goTo(p)}>{p}</button>
              ))}
              <button className="page-btn" disabled={page === totalPages} onClick={() => goTo(page + 1)}>Next</button>
            </div>
          )}
        </>
      )}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete link"
        message={`Are you sure you want to delete /${deleteTarget?.short}? This action cannot be undone.`}
        onConfirm={() => {
          // TODO: call API to delete
          setDeleteTarget(null)
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

export default MyLinks
