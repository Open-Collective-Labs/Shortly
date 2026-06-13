import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { FiSearch, FiCopy, FiTrash2, FiExternalLink } from 'react-icons/fi'
import { api } from '../lib/api'
import { queryClient } from '../lib/queryClient'
import { SkeletonTable } from '../components/Skeleton'
import ConfirmModal from '../components/ConfirmModal'
import './MyLinks.css'

const PAGE_SIZE = 10

function MyLinks() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data: links, isLoading } = useQuery({
    queryKey: ['links'],
    queryFn: () => api.listLinks(100, 0),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteLink(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })

  const filtered = (links || []).filter(
    (link) =>
      link.original_url?.toLowerCase().includes(search.toLowerCase()) ||
      link.code?.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function goTo(p) {
    if (p >= 1 && p <= totalPages) setPage(p)
  }

  async function handleCopy(shortUrl) {
    try {
      await navigator.clipboard.writeText(shortUrl)
    } catch {
      // fallback
    }
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id)
    setDeleteTarget(null)
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

      {isLoading ? (
        <SkeletonTable rows={5} />
      ) : filtered.length === 0 ? (
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
                  <span className="status-dot active" />
                  <span className="short-code">/{link.code}</span>
                </span>
                <span className="col-url" title={link.original_url}>{link.original_url}</span>
                <span className="col-clicks">{link.clicks.toLocaleString()}</span>
                <span className="col-created">{new Date(link.created_at).toLocaleDateString()}</span>
                <span className="col-actions">
                  <button className="icon-btn" title="Copy" onClick={() => handleCopy(link.short_url)}>
                    <FiCopy size={16} />
                  </button>
                  <a href={link.short_url} target="_blank" className="icon-btn" title="Open">
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
        message={`Are you sure you want to delete /${deleteTarget?.code}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

export default MyLinks
