import './Skeleton.css'

function Skeleton({ className = '', width, height, borderRadius = '8px' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius }}
    />
  )
}

function SkeletonRow({ cols }) {
  return (
    <div className="skeleton-row">
      {cols.map((w, i) => (
        <Skeleton key={i} width={w} height="18px" />
      ))}
    </div>
  )
}

function SkeletonTable({ rows = 5 }) {
  return (
    <div className="skeleton-table">
      <SkeletonRow cols={['160px', '1fr', '80px', '100px', '120px']} />
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow
          key={i}
          cols={['160px', '1fr', '80px', '100px', '120px']}
        />
      ))}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="skeleton skeleton-card">
      <Skeleton width="44px" height="44px" borderRadius="10px" />
      <div className="skeleton-card-body">
        <Skeleton width="80px" height="24px" />
        <Skeleton width="60px" height="14px" />
      </div>
    </div>
  )
}

export { Skeleton, SkeletonRow, SkeletonTable, SkeletonCard }
