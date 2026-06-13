import { useState } from 'react'
import { FiLink, FiMousePointer, FiActivity, FiTrendingUp } from 'react-icons/fi'
import './Dashboard.css'

const TOP_LINKS = [
  { rank: 1, short: 'abc123', url: 'example.com/very/long/path...', clicks: 142 },
  { rank: 2, short: 'def456', url: 'docs.example.com/getting-started...', clicks: 87 },
  { rank: 3, short: 'ghi789', url: 'blog.example.com/posts/why-url-...', clicks: 34 },
  { rank: 4, short: 'jkl012', url: 'shop.example.com/products/12345...', clicks: 21 },
  { rank: 5, short: 'mno345', url: 'news.example.com/article/break...', clicks: 15 },
]

const PAGE_SIZE = 3

function Dashboard() {
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(TOP_LINKS.length / PAGE_SIZE)
  const paged = TOP_LINKS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function goTo(p) {
    if (p >= 1 && p <= totalPages) setPage(p)
  }

  return (
    <div className="page">
      <h2 className="page-title">Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon--links"><FiLink size={22} /></div>
          <div className="stat-body">
            <span className="stat-value">24</span>
            <span className="stat-label">Total Links</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--clicks"><FiMousePointer size={22} /></div>
          <div className="stat-body">
            <span className="stat-value">3,847</span>
            <span className="stat-label">Total Clicks</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--active"><FiActivity size={22} /></div>
          <div className="stat-body">
            <span className="stat-value">22</span>
            <span className="stat-label">Active Links</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--avg"><FiTrendingUp size={22} /></div>
          <div className="stat-body">
            <span className="stat-value">160</span>
            <span className="stat-label">Avg. Clicks / Link</span>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h3 className="section-title">Top Performing Links</h3>
        <div className="top-links">
          {paged.map((link) => (
            <div className="top-link-row" key={link.rank}>
              <div className="top-link-rank">{link.rank}</div>
              <div className="top-link-info">
                <span className="top-link-short">/{link.short}</span>
                <span className="top-link-url">{link.url}</span>
              </div>
              <div className="top-link-clicks">
                <span className="top-link-num">{link.clicks}</span>
                <span className="top-link-label">clicks</span>
              </div>
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
      </div>
    </div>
  )
}

export default Dashboard
