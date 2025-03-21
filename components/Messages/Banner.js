import React from 'react'

function Banner({ bannerData }) {
  const { name, profilePicUrl } = bannerData

  return (
    <div className="chat-header">
      <img className="chat-header-avatar" src={profilePicUrl} alt={name} />
      <div>
        <div className="chat-header-name">{name}</div>
        <div className="chat-header-status">
          <span className="status-indicator"></span>
          Online
        </div>
      </div>
    </div>
  )
}

export default Banner