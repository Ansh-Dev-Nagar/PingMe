import React, { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import cookie from 'js-cookie'
import baseUrl from '../../utils/baseUrl'
import { List, Image } from 'semantic-ui-react'
import { NoResults } from '../Layout/NoData'

function ChatListSearch({ chats, setChats, user }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const router = useRouter()

  const handleChange = e => {
    const { value } = e.target
    setText(value)

    if (value.length === 0) return setResults([])

    if (value.trim().length === 0) return

    setLoading(true)

    try {
      (async () => {
        const res = await axios.get(`${baseUrl}/api/search/${value}`, {
          headers: { Authorization: cookie.get('token') }
        })

        setResults(res.data)
      })()
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  const addChat = result => {
    const alreadyInChat =
      chats.length > 0 &&
      chats.filter(chat => chat.messagesWith === result._id).length > 0

    if (alreadyInChat) {
      return router.push(`/messages?message=${result._id}`)
    }

    const newChat = {
      messagesWith: result._id,
      name: result.name,
      profilePicUrl: result.profilePicUrl,
      date: Date.now()
    }

    setChats(prev => [newChat, ...prev])

    return router.push(`/messages?message=${result._id}`)
  }

  return (
    <div className="search-wrapper">
      <input
        placeholder="Search for chats"
        value={text}
        onChange={handleChange}
        className="search-input"
      />
      {loading ? (
        <div className="search-loading">
          <div className="search-loading-spinner"></div>
          <span>Searching...</span>
        </div>
      ) : results.length > 0 ? (
        <List verticalAlign="middle" className="search-results">
          {results.map(result => (
            <List.Item
              key={result._id}
              onClick={() => addChat(result)}
              className="search-result-item"
            >
              <Image avatar src={result.profilePicUrl} alt="Profile Pic" />
              <List.Content>
                <List.Header className="search-result-name">{result.name}</List.Header>
                <List.Description className="search-result-username">
                  @{result.username}
                </List.Description>
              </List.Content>
            </List.Item>
          ))}
        </List>
      ) : text.length > 0 && !loading && results.length === 0 ? (
        <div className="search-no-results">
          <NoResults />
        </div>
      ) : null}
    </div>
  )
}

export default ChatListSearch