import React, { useState, useEffect } from 'react'
import { loginUser } from '../utils/authUser'
import cookie from 'js-cookie'
import Head from 'next/head'
import Link from 'next/link'

function Login() {
  const [user, setUser] = useState({ email: '', password: '' })

  const { email, password } = user
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [submitDisabled, setSubmitDisabled] = useState(true)

  const handleChange = e => {
    const { name, value } = e.target
    setUser(prev => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const isUser = Object.values({ email, password }).every(item => Boolean(item))
    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true)
  }, [user])

  const handleSubmit = async e => {
    e.preventDefault()
    setFormLoading(true)
    await loginUser(user, setErrorMsg, setFormLoading)
  }

  useEffect(() => {
    const userEmail = cookie.get('userEmail')
    if (userEmail) setUser(prev => ({ ...prev, email: userEmail }))
  }, [])

  return (
    <>
      <Head>
        <title>Login | PingMe</title>
        <meta name="description" content="Login to PingMe - Connect with friends in real-time" />
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
            <a className="auth-nav-button primary">
              <span>Login</span>
            </a>
          </Link>
          <Link href="/signup">
            <a className="auth-nav-button secondary">
              <span>Sign Up</span>
            </a>
          </Link>
        </nav>
      </header>

      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-left">
            <h2>Welcome Back!</h2>
            <p>Sign in to continue your journey with PingMe. Connect with your friends, share moments, and stay in touch with your communities.</p>
          </div>

          <div className="auth-form-container">
            <div className="auth-form">
              <h1>Sign In</h1>
              <p>Access your PingMe account</p>

              <form onSubmit={handleSubmit} className="auth-form-inner">
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
                      placeholder="Enter your password"
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

                {errorMsg && <div className="error-message">{errorMsg}</div>}

                <button
                  type="submit"
                  className={`submit-button ${formLoading ? 'loading' : ''}`}
                  disabled={submitDisabled || formLoading}
                >
                  Sign In
                </button>
              </form>

              <footer className="auth-footer">
                <span>New to PingMe?</span>
                <Link href="/signup">
                  <a>Create your account</a>
                </Link>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login