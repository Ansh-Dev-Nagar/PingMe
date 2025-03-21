import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import axios from 'axios'
import baseUrl from '../utils/baseUrl'
import { parseCookies } from 'nookies'
import { useRouter } from 'next/router'
import Chat from '../components/Chats/Chat'
import ChatListSearch from '../components/Chats/ChatListSearch'
import { NoMessages } from '../components/Layout/NoData'
import Banner from '../components/Messages/Banner'
import MessageInputField from '../components/Messages/MessageInputField'
import Message from '../components/Messages/Message'
import getUserInfo from '../utils/getUserInfo'
import newMsgSound from '../utils/newMsgSound'
import cookie from 'js-cookie'
import { initSidebarHover } from '../utils/sidebarHover'

const scrollDivToBottom = divRef => {
  if (divRef.current !== null) {
    divRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
}

function Messages({ chatsData, user, errorLoading })
{
  const [chats, setChats] = useState(chatsData || [])
  const router = useRouter()

  const socket = useRef()
  const [connectedUsers, setConnectedUsers] = useState([])

  const [messages, setMessages] = useState([])
  const [bannerData, setBannerData] = useState({ name: '', profilePicUrl: '' })

  const divRef = useRef()

  // This ref is for persisting the state of query string in url throughout re-renders. This ref is the value of query string inside url
  const openChatId = useRef('')

  // Initialize sidebar hover effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initSidebarHover();
      
      // Ensure chat properly adjusts to sidebar state on load
      const sidebar = document.querySelector('.side-menu');
      if (sidebar && sidebar.matches(':hover')) {
        document.body.classList.add('sidebar-hovered');
      } else {
        document.body.classList.remove('sidebar-hovered');
      }
    }
  }, []);

  // If there's an error loading or no user, don't initialize socket connection
  useEffect(() =>
  {
    if(errorLoading || !user) return;
    
    if(!socket.current)
    {
      socket.current = io(baseUrl)
    }

    if(socket.current)
    {
      socket.current.emit('join', { userId: user._id })

      socket.current.on('connectedUsers', ({ users }) =>
      {
        users.length > 0 && setConnectedUsers(users)
      })

      if(chats.length > 0 && !router.query.message)
      {
        router.push(`/messages?message=${chats[0].messagesWith}`, undefined, { shallow: true })
      }
    }

    return () =>
    {
      if(socket.current)
      {
        socket.current.emit('disconnect')
        socket.current.off()
      }
    }

  }, [])

  // Add this useEffect near the other useEffect hooks
  useEffect(() => {
    // Add chat-open class to body when component mounts
    document.body.classList.add('chat-open');
    
    // Remove chat-open class when component unmounts
    return () => {
      document.body.classList.remove('chat-open');
    };
  }, []);

  // LOAD MESSAGES useEffect
  useEffect(() =>
  {
    const loadMessages = () =>
    {
      socket.current.emit('loadMessages', { userId: user._id, messagesWith: router.query.message })

      socket.current.on('messagesLoaded', async ({ chat }) =>
      {
        setMessages(chat.messages)
      
        setBannerData({ name: chat.messagesWith.name, profilePicUrl: chat.messagesWith.profilePicUrl })

        openChatId.current = chat.messagesWith._id

        divRef.current && scrollDivToBottom(divRef)
      })

      socket.current.on('noChatFound', async () =>
      {
        const { name, profilePicUrl } = await getUserInfo(router.query.message)

        setBannerData({ name, profilePicUrl })
        setMessages([])

        openChatId.current = router.query.message
      })
    }

    if(socket.current && router.query.message) loadMessages()
  
  }, [router.query.message])

  
  const sendMsg = msg =>
  {
    if(socket.current)
    {
      socket.current.emit('sendNewMsg', { userId: user._id, msgSendToUserId: openChatId.current, msg })
    }
  }


  // Confirming msg is sent and receving the messages useEffect
  useEffect(() =>
  {
    if(socket.current)
    {
      socket.current.on('msgSent', ({ newMsg }) =>
      {
        if(newMsg.receiver.toString() === openChatId.current.toString())
        {
          setMessages(prev => [...prev, newMsg])

          setChats(prev =>
          {
            const previousChat = prev.find(chat => chat.messagesWith.toString() === newMsg.receiver.toString())

            if(previousChat === undefined)
            return [...prev]

            previousChat.lastMessage = newMsg.msg
            previousChat.date = newMsg.date

            return [...prev]
          })
        }
      })

      socket.current.on('newMsgReceived', async ({ newMsg }) =>
      {
        let senderName

        let flag = false

        chats.filter(chat =>
        {
          if(chat.messagesWith.toString() === newMsg.sender.toString())
          {
            flag = true
          }
          
        })

        // WHEN CHAT WITH SENDER IS CURRENTLY OPENED INSIDE YOUR BROWSER
        if(flag && newMsg.sender.toString() === openChatId.current.toString())
        {
          setMessages(prev => [...prev, newMsg])

          setChats(prev =>
          {
            const previousChat = prev.find(chat => chat.messagesWith.toString() === newMsg.sender.toString())

            if(previousChat === undefined)
            return [...prev]

            previousChat.lastMessage = newMsg.msg
            previousChat.date = newMsg.date

            senderName = previousChat.name

            return [...prev]
          })
        }
        else
        {
          const ifPreviouslyMessaged = flag

          if(ifPreviouslyMessaged)
          {
            setChats(prev =>
            {
              const previousChat = prev.find(chat => chat.messagesWith.toString() === newMsg.sender.toString())

              if(previousChat === undefined)
              return [...prev]

              previousChat.lastMessage = newMsg.msg
              previousChat.date = newMsg.date

              senderName = previousChat.name

              return [ previousChat, ...prev.filter(chat => chat.messagesWith.toString() !== newMsg.sender.toString()) ]
            })
          }
          else
          {
            const { name, profilePicUrl } = await getUserInfo(newMsg.sender)
          
            senderName = name

            const newChat =
            {
              messagesWith: newMsg.sender,
              name,
              profilePicUrl,
              lastMessage: newMsg.msg,
              date: newMsg.date
            }
            
            setChats(prev => [newChat, ...prev])
          }
        }

        newMsgSound(senderName)
      })
    }

  }, [])
  

  useEffect(() =>
  {
    messages.length > 0 && scrollDivToBottom(divRef)
  
  }, [messages])


  const deleteMsg = messageId =>
  {
    if(socket.current)
    {
      socket.current.emit('deleteMsg',
      {
        userId: user._id,
        messagesWith: openChatId.current,
        messageId
      })

      socket.current.on('msgDeleted', () =>
      {
        setMessages(prev => prev.filter(message => message._id.toString() !== messageId.toString()))
      })
    }
  }


  const deleteChat = async messagesWith =>
  {
    try
    {
      await axios.delete(`${baseUrl}/api/chats/${messagesWith}`, { headers: { Authorization: cookie.get('token') } })

      setChats(prev => prev.filter(chat => chat.messagesWith.toString() !== messagesWith.toString()))
      
      router.push('/messages', undefined, { shallow: true })
    }
    catch(error)
    {
      alert('Error deleting chat')
    }
  }


  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <div className="chat-sidebar">
          <div className="chat-search">
            <ChatListSearch chats={chats} setChats={setChats} user={user} />
          </div>
          <div className="chat-list">
            {chats.length > 0 ? (
              chats.map((chat, i) => (
                <Chat
                  key={i}
                  chat={chat}
                  connectedUsers={connectedUsers}
                  deleteChat={deleteChat}
                />
              ))
            ) : (
              <NoMessages />
            )}
          </div>
        </div>

        <div className="chat-main">
          {router.query.message ? (
            <>
              <Banner bannerData={bannerData} />
              <div className="chat-messages">
                <div className="messages-container">
                  {messages.length > 0 &&
                    messages.map((message, i) => (
                      <Message
                        key={i}
                        bannerProfilePic={bannerData.profilePicUrl}
                        message={message}
                        user={user}
                        deleteMsg={deleteMsg}
                        divRef={i === messages.length - 1 ? divRef : null}
                      />
                    ))}
                  <div ref={divRef} />
                </div>
              </div>
              <MessageInputField sendMsg={sendMsg} />
            </>
          ) : (
            <div className="chat-messages" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

Messages.getInitialProps = async ctx =>
{
  try
  {
    const { token } = parseCookies(ctx)
    
    // Make sure token exists
    if (!token) {
      return { errorLoading: true }
    }

    const res = await axios.get(`${baseUrl}/api/chats`, { headers: { Authorization: token } })
    return { chatsData: res.data }
  }
  catch(error)
  {
    return { errorLoading: true }
  }
}

export default Messages