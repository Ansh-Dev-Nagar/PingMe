import React, { useState, useEffect } from 'react'
import { Form, Button, Message, Segment } from 'semantic-ui-react'
import { loginUser } from '../utils/authUser'
import { FooterMessage } from '../components/Common/FooterMessage'
import cookie from 'js-cookie'
import Head from 'next/head'

function Login()
{
  const [user, setUser] = useState({ email: '', password: '' })

  const { email, password } = user
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [submitDisabled, setSubmitDisabled] = useState(true)


  const handleChange = e =>
  {
    const { name, value } = e.target

    setUser(prev => ({ ...prev, [name]: value }))
  }


  useEffect(() =>
  {
    const isUser = Object.values({ email, password }).every(item => Boolean(item))
  
    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true)
  
  }, [user])

  const handleSubmit = async e =>
  {
    e.preventDefault()

    await loginUser(user, setErrorMsg, setFormLoading)
  }


  useEffect(() =>
  {
    document.title = 'Welcome Back'
  
    const userEmail = cookie.get('userEmail')
  
    if (userEmail) setUser(prev => ({ ...prev, email: userEmail }))
  
  }, [])
  

  return (
    <>
      <Head>
        <title>Login | PingMe</title>
        <meta name="description" content="Login to PingMe - Connect with friends in real-time" />
      </Head>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to continue to PingMe</p>
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
                placeholder='Enter your password'
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

            <Button
              icon='sign in'
              content='Sign In'
              type='submit'
              disabled={submitDisabled}
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

export default Login