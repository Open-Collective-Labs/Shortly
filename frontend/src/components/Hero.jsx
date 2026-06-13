import './Hero.css'
import ShortenCard from './ShortenCard'

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Short links. Done right.</h1>
        <p>Open-source URL shortener with analytics &amp; custom slugs</p>
        <ShortenCard />
      </div>
    </section>
  )
}

export default Hero
