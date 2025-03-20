import React, { useState, useRef } from 'react'
import { Form } from 'semantic-ui-react'
import axios from 'axios'
import baseUrl from '../utils/baseUrl'
import { registerUser } from '../utils/authUser'
import uploadPic from '../utils/uploadPicToCloudinary'
import Link from 'next/link'
import Head from 'next/head'

const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/

function Signup()
{
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    username: ''
  })

  const { name, email, password, username } = user
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [submitDisabled, setSubmitDisabled] = useState(true)

  const [media, setMedia] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)
  const inputRef = useRef()

  const handleChange = e =>
  {
    const { name, value } = e.target

    setUser(prev => ({ ...prev, [name]: value }))
  }

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

  const handleImageChange = e =>
  {
    const { files } = e.target
    setMedia(files[0])
    setMediaPreview(URL.createObjectURL(files[0]))
  }

  React.useEffect(() =>
  {
    const isUser = Object.values({ name, email, password, username }).every(item => Boolean(item))
    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true)
  }, [user])

  return (
    <>
      <Head>
        <title>Sign Up | PingMe</title>
        <meta name="description" content="Create your PingMe account - Connect with friends in real-time" />
      </Head>

      <header className="main-header">
        <Link href="/">
          <a className="main-logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            <span>PingMe</span>
          </a>
        </Link>
        <nav className="auth-nav">
          <Link href="/login">
            <a className="auth-nav-button secondary">
              <span>Login</span>
            </a>
          </Link>
          <Link href="/signup">
            <a className="auth-nav-button primary">
              <span>Sign Up</span>
            </a>
          </Link>
        </nav>
      </header>

      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-left">
            <h2>Connect with Friends in Real-time</h2>
            <p>Join PingMe today and stay connected with your friends, family, and communities. Share moments, chat instantly, and build meaningful connections.</p>
          </div>

          <div className="auth-form-container">
            <div className="auth-form">
              <h1>Create Account</h1>
              <p>Join PingMe and start connecting with friends</p>

              <Form onSubmit={handleSubmit}>
                <div 
                  className="image-upload-container"
                  onClick={() => inputRef.current.click()}
                >
                  {mediaPreview ? (
                    <img src={mediaPreview} alt="Profile" className="image-preview" />
                  ) : (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                      />
                    </svg>
                  )}
                  <input
                    ref={inputRef}
                    onChange={handleImageChange}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                </div>

                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    className="form-control"
                    placeholder="Enter your full name"
                    name="name"
                    value={name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    className="form-control"
                    placeholder="Enter your email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <div className="password-input-wrapper">
                    <input
                      className="form-control"
                      placeholder="Create a password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Username</label>
                  <input
                    className="form-control"
                    placeholder="Choose a username"
                    name="username"
                    value={username}
                    onChange={handleChange}
                  />
                </div>

                {errorMsg && <div className="error-message">{errorMsg}</div>}

                <button
                  type="submit"
                  className={`submit-button ${formLoading ? 'loading' : ''}`}
                  disabled={submitDisabled || formLoading}
                >
                  Create Account
                </button>
              </Form>

              <div className="auth-footer">
                Already have an account?
                <Link href="/login">
                  <a>Login Here Instead</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup