import React from 'react'
import { useRouter } from 'next/router'
import calculateTime from '../../utils/calculateTime'

function Chat({ chat, connectedUsers, deleteChat }) {
  const router = useRouter()
  const isOnline = connectedUsers.length > 0 && connectedUsers.filter(user => user.userId === chat.messagesWith).length > 0
  const isActive = router.query.message === chat.messagesWith

  const handleDeleteChat = (e) => {
    e.stopPropagation();
    deleteChat(chat.messagesWith);
  }

  return (
    <div
      className={`chat-item ${isActive ? 'active' : ''}`}
      onClick={() => router.push(`/messages?message=${chat.messagesWith}`, undefined, { shallow: true })}
    >
      <img className="chat-item-avatar" src={chat.profilePicUrl} alt={chat.name} />
      <div className="chat-item-content">
        <div className="chat-item-name">
          {chat.name} {isOnline && <span style={{ color: '#10B981' }}>●</span>}
        </div>
        <div className="chat-item-message">
          {chat.lastMessage.length > 25 ? `${chat.lastMessage.substring(0, 25)}...` : chat.lastMessage}
        </div>
      </div>
      <div className="chat-item-actions">
        <div style={{ fontSize: '0.75rem', color: '#65676b' }}>{calculateTime(chat.date)}</div>
        <div className="chat-item-delete" onClick={handleDeleteChat}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Chat