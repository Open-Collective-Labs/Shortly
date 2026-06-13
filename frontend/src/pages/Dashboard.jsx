import { useQuery } from '@tanstack/react-query'
import { FiLink, FiMousePointer, FiActivity, FiTrendingUp } from 'react-icons/fi'
import { api } from '../lib/api'
import { SkeletonCard } from '../components/Skeleton'
import '../components/Skeleton.css'
import './Dashboard.css'

function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => api.getStats(),
  })

  const { data: links, isLoading: linksLoading } = useQuery({
    queryKey: ['links'],
    queryFn: () => api.listLinks(100, 0),
  })

  const topLinks = (links || [])
    .slice()
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5)
    .map((l, i) => ({ ...l, rank: i + 1 }))

  return (
    <div className="page">
      <h2 className="page-title">Dashboard</h2>

      <div className="stats-grid">
        {statsLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <div className="stat-card">
              <div className="stat-icon stat-icon--links"><FiLink size={22} /></div>
              <div className="stat-body">
                <span className="stat-value">{stats?.total_links ?? 0}</span>
                <span className="stat-label">Total Links</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon--clicks"><FiMousePointer size={22} /></div>
              <div className="stat-body">
                <span className="stat-value">{(stats?.total_clicks ?? 0).toLocaleString()}</span>
                <span className="stat-label">Total Clicks</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon--active"><FiActivity size={22} /></div>
              <div className="stat-body">
                <span className="stat-value">{stats?.total_links ?? 0}</span>
                <span className="stat-label">Active Links</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon--avg"><FiTrendingUp size={22} /></div>
              <div className="stat-body">
                <span className="stat-value">{Math.round(stats?.average_clicks ?? 0)}</span>
                <span className="stat-label">Avg. Clicks / Link</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="dashboard-section">
        <h3 className="section-title">Top Performing Links</h3>
        {linksLoading ? (
          <div className="top-links">
            {Array.from({ length: 3 }).map((_, i) => (
              <div className="top-link-row" key={i}>
                <div className="skeleton" style={{ width: 28, height: 28, borderRadius: '50%' }} />
                <div className="top-link-info">
                  <div className="skeleton" style={{ width: 120, height: 16, borderRadius: 4 }} />
                  <div className="skeleton" style={{ width: 200, height: 14, borderRadius: 4, marginTop: 4 }} />
                </div>
                <div className="skeleton" style={{ width: 60, height: 16, borderRadius: 4 }} />
              </div>
            ))}
          </div>
        ) : topLinks.length === 0 ? (
          <p className="page-empty" style={{ marginTop: 0 }}>No links yet.</p>
        ) : (
          <div className="top-links">
            {topLinks.map((link) => (
              <div className="top-link-row" key={link.id}>
                <div className="top-link-rank">{link.rank}</div>
                <div className="top-link-info">
                  <span className="top-link-short">/{link.code}</span>
                  <span className="top-link-url">{link.original_url}</span>
                </div>
                <div className="top-link-clicks">
                  <span className="top-link-num">{link.clicks}</span>
                  <span className="top-link-label">clicks</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
