import React, { useState } from 'react'

function MessageInputField({ sendMsg }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    e.stopPropagation()
    
    if (text.trim().length === 0) return
    
    setLoading(true)
    sendMsg(text)
    setText('')
    setLoading(false)
  }

  return (
    <div className="chat-input">
      <form onSubmit={handleSubmit} className="chat-input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={e => setText(e.target.value)}
          autoComplete="off"
        />
        <button 
          type="button" 
          disabled={text.trim().length === 0 || loading}
          onClick={handleSubmit}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="20"
            height="20"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </form>
    </div>
  )
}

export default MessageInputField