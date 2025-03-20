import React, { useState, useEffect, useRef } from 'react'
import { Form, Button, Message } from 'semantic-ui-react'
import ImageDropDiv from '../components/Common/ImageDropDiv'
import { FooterMessage } from '../components/Common/FooterMessage'
import axios from 'axios'
import baseUrl from '../utils/baseUrl'
import { registerUser } from '../utils/authUser'
import uploadPic from '../utils/uploadPicToCloudinary'
import Head from 'next/head'

const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/

let cancel

function Signup()
{
  const [user, setUser] = useState({ name: '', email: '', password: '' })

  const { name, email, password, bio } = user


  const handleChange = e =>
  {
    const { name, value, files } = e.target

    if(name === 'media')
    {
      setMedia(files[0])
      setMediaPreview(URL.createObjectURL(files[0]))
    }

    setUser(prev => ({ ...prev, [name]: value }))
  }


  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [submitDisabled, setSubmitDisabled] = useState(true)

  const [username, setUsername] = useState('')
  const [usernameLoading, setUsernameLoading] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState(false)

  const [media, setMedia] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)
  const [highlighted, setHighlighted] = useState(false)
  const inputRef = useRef()


  useEffect(() =>
  {
    const isUser = Object.values({ name, email, password }).every(item => Boolean(item))

    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true)
 
  }, [user])


  const checkUsername = async () =>
  {
    setUsernameLoading(true)
  
    try
    {
      cancel && cancel()

      const CancelToken = axios.CancelToken

      const res = await axios.get(`${baseUrl}/api/signup/${username}`, { cancelToken: new CancelToken(canceler => cancel = canceler) })

      if(errorMsg !== null) setErrorMsg(null)

      if(res.data === 'Available')
      {
        setUsernameAvailable(true)
        setUser(prev => ({ ...prev, username }))
      }

    }
    catch(error)
    {
      setErrorMsg('Username Not Available')
      setUsernameAvailable(false)
    }

    setUsernameLoading(false)
  }


  useEffect(() =>
  {
    username === '' ? setUsernameAvailable(false) : checkUsername()
  
  }, [username])

  
  const handleSubmit = async e =>
  {
    e.preventDefault()
    setFormLoading(true)

    let profilePicUrl
  
    if(media !== null)
    {
      profilePicUrl = await uploadPic(media)
    }

    if(media !== null && !profilePicUrl)
    {
      setFormLoading(false)
      return setErrorMsg('Error Uploading Image')
    }

    await registerUser(user, profilePicUrl, setErrorMsg, setFormLoading)
  }


  return (
    <>
      <Head>
        <title>Sign Up | PingMe</title>
        <meta name="description" content="Create your PingMe account - Connect with friends in real-time" />
      </Head>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Join PingMe and start connecting with friends</p>
          </div>

          <Form loading={formLoading} error={errorMsg !== null} onSubmit={handleSubmit} className="auth-form">
            {errorMsg && (
              <div className="error-message">
                <Message
                  error
                  header='Oops!'
                  content={errorMsg}
                  onDismiss={() => setErrorMsg(null)}
                />
              </div>
            )}

            <div className="image-drop-container">
              <ImageDropDiv
                mediaPreview={mediaPreview}
                setMediaPreview={setMediaPreview}
                setMedia={setMedia}
                inputRef={inputRef}
                highlighted={highlighted}
                setHighlighted={setHighlighted}
                handleChange={handleChange}
              />
            </div>

            <Form.Field>
              <label>Full Name</label>
              <Form.Input
                required
                placeholder='Enter your full name'
                name='name'
                value={name}
                onChange={handleChange}
                icon='user'
                iconPosition='left'
              />
            </Form.Field>

            <Form.Field>
              <label>Email</label>
              <Form.Input
                required
                placeholder='Enter your email'
                name='email'
                value={email}
                onChange={handleChange}
                icon='envelope'
                iconPosition='left'
                type='email'
              />
            </Form.Field>

            <Form.Field>
              <label>Password</label>
              <Form.Input
                placeholder='Create a password'
                name='password'
                value={password}
                onChange={handleChange}
                icon={{
                  name: showPassword ? 'eye slash' : 'eye',
                  circular: true,
                  link: true,
                  onClick: () => setShowPassword(!showPassword)
                }}
                iconPosition='left'
                type={showPassword ? 'text' : 'password'}
                required
              />
            </Form.Field>

            <Form.Field>
              <label>Username</label>
              <Form.Input
                loading={usernameLoading}
                error={!usernameAvailable}
                required
                placeholder='Choose a username'
                value={username}
                onChange={e => {
                  setUsername(e.target.value)
                  if(regexUserName.test(e.target.value)) {
                    setUsernameAvailable(true)
                  } else {
                    setUsernameAvailable(false)
                  }
                }}
                icon={usernameAvailable ? 'check' : 'close'}
                iconPosition='left'
              />
            </Form.Field>

            <Button
              icon='user plus'
              content='Create Account'
              type='submit'
              disabled={submitDisabled || !usernameAvailable}
            />
          </Form>

          <div className="auth-footer">
            <FooterMessage />
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup