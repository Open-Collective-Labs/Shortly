import { useEffect, useRef } from 'react'

const SPACING = 32
const RADIUS = 2
const WAVE_RADIUS = 120
const WAVE_STRENGTH = 6

function DotsBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let mouse = { x: -9999, y: -9999 }

    const dots = []

    const HEADER_H = 60

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight - HEADER_H
      canvas.style.top = HEADER_H + 'px'
      dots.length = 0
      for (let x = 0; x < canvas.width; x += SPACING) {
        for (let y = 0; y < canvas.height; y += SPACING) {
          const hue = ((x / canvas.width) * 60 + (y / canvas.height) * 60 + 240) % 360
          dots.push({ x, y, ox: x, oy: y, hue })
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const d of dots) {
        const dx = d.ox - mouse.x
        const dy = d.oy - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < WAVE_RADIUS) {
          const force = (1 - dist / WAVE_RADIUS) * WAVE_STRENGTH
          const angle = Math.atan2(dy, dx)
          d.x = d.ox + Math.cos(angle) * force * WAVE_RADIUS * 0.3
          d.y = d.oy + Math.sin(angle) * force * WAVE_RADIUS * 0.3
        } else {
          d.x += (d.ox - d.x) * 0.05
          d.y += (d.oy - d.y) * 0.05
        }

        ctx.beginPath()
        ctx.arc(d.x, d.y, RADIUS, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${d.hue}, 50%, 60%, 0.4)`
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    function onMouseMove(e) {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    function onMouseLeave() {
      mouse.x = -9999
      mouse.y = -9999
    }

    resize()
    draw()

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        display: 'block',
      }}
    />
  )
}

export default DotsBackground
