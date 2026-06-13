import { NavLink } from 'react-router-dom'
import { FaGithub } from 'react-icons/fa'
import { FiTerminal } from 'react-icons/fi'
import './Header.css'

function Header() {
  return (
    <header>
      <nav>
        <NavLink to="/" className="logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="logo-icon">
            <rect width="28" height="28" rx="6" fill="#08060d" />
            <text x="14" y="20" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="700" fontFamily="'Google Sans Flex', sans-serif">S</text>
          </svg>
          Shortly
        </NavLink>
        <div className="tabs">
          <NavLink to="/" end className="tab">Create</NavLink>
          <NavLink to="/links" className="tab">My Links</NavLink>
          <NavLink to="/dashboard" className="tab">Dashboard</NavLink>
          <div className="spacer" />
          <NavLink to="/api" className="tab"><FiTerminal size={20} /> API</NavLink>
          <a href="https://github.com/Open-Collective-Labs/Shortly" className="tab tab-github" target="_blank"><FaGithub size={20} /> GitHub</a>
        </div>
      </nav>
    </header>
  )
}

export default Header
