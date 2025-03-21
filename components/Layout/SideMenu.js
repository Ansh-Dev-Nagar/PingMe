import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { logoutUser } from '../../utils/authUser'

function SideMenu({ user: { email, unreadMessage, username }, pc = true }) {
  const router = useRouter()
  const isActive = route => router.pathname === route

  return (
    <div className="side-menu">
      <div className="side-menu-top">
        <div className="sidebar-logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          <span className="logo-text">PingMe</span>
        </div>
      </div>

      <div className="side-menu-main">
        <Link href="/messages">
          <a className={`menu-item ${isActive('/messages') ? 'active' : ''}`} title="Messages">
            <div className="menu-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              {unreadMessage && <span className="notification-dot" title="Unread messages"></span>}
            </div>
            {pc && <span className="menu-label">Messages</span>}
          </a>
        </Link>

        <Link href={`/${username}`}>
          <a className={`menu-item ${router.query.username === username ? 'active' : ''}`} title="My Profile">
            <div className="menu-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            {pc && <span className="menu-label">Profile</span>}
          </a>
        </Link>
      </div>

      <div className="side-menu-bottom">
        <div className="menu-item" title="Logout" onClick={() => logoutUser(email)}>
          <div className="menu-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </div>
          {pc && <span className="menu-label">Logout</span>}
        </div>
      </div>
    </div>
  )
}

export default SideMenu