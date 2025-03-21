import React, { useState, useEffect } from 'react'
import { Header, Button, Icon, Modal, Form, Message } from 'semantic-ui-react'
import { logoutUser } from '../../utils/authUser'
import { updatePassword } from '../../utils/profileActions'

function Settings({ user }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setShowPasswordModal(false)
        resetPasswordForm()
        setSuccess(false)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [success])

  const handlePasswordChange = e => {
    const { name, value } = e.target
    setPassword(prev => ({ ...prev, [name]: value }))
  }

  const resetPasswordForm = () => {
    setPassword({ current: '', new: '', confirm: '' })
    setErrorMsg(null)
  }

  const handlePasswordSubmit = async () => {
    if (password.new !== password.confirm) {
      return setErrorMsg("New passwords don't match")
    }

    await updatePassword(
      setLoading,
      setErrorMsg,
      setSuccess,
      password.current,
      password.new
    )
  }

  return (
    <div className="profile-content">
      <Header as="h1" className="update-profile-title">
        <Icon name="settings" />
        <Header.Content>Account Settings</Header.Content>
      </Header>
      
      <div className="profile-setting">
        <div className="profile-setting-info">
          <div className="profile-setting-title">Change Password</div>
          <div className="profile-setting-description">Update your password to keep your account secure</div>
        </div>
        <div className="profile-setting-action">
          <Button 
            className="profile-button" 
            onClick={() => setShowPasswordModal(true)}
          >
            Change
          </Button>
        </div>
      </div>

      <div className="profile-setting">
        <div className="profile-setting-info">
          <div className="profile-setting-title">Log Out</div>
          <div className="profile-setting-description">Sign out from your account</div>
        </div>
        <div className="profile-setting-action">
          <Button 
            className="profile-button"
            onClick={() => logoutUser(user.email)}
          >
            Log Out
          </Button>
        </div>
      </div>

      <div className="profile-setting" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
        <div className="profile-setting-info">
          <div className="profile-setting-title" style={{ color: '#ef4444' }}>Delete Account</div>
          <div className="profile-setting-description">Permanently delete your account and all your data</div>
        </div>
        <div className="profile-setting-action">
          <Button 
            color="red" 
            onClick={() => setShowDeleteAccountModal(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Password Change Modal */}
      <Modal
        open={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false)
          resetPasswordForm()
        }}
        size="tiny"
      >
        <Modal.Header>Change Your Password</Modal.Header>
        <Modal.Content>
          <Form error={errorMsg !== null} success={success} loading={loading}>
            <Message error content={errorMsg} />
            <Message success content="Password updated successfully!" />
            
            <Form.Field>
              <label>Current Password</label>
              <input 
                type="password" 
                name="current" 
                value={password.current} 
                onChange={handlePasswordChange}
                placeholder="Enter your current password"
              />
            </Form.Field>
            
            <Form.Field>
              <label>New Password</label>
              <input 
                type="password" 
                name="new" 
                value={password.new} 
                onChange={handlePasswordChange}
                placeholder="Enter new password"
              />
            </Form.Field>
            
            <Form.Field>
              <label>Confirm New Password</label>
              <input 
                type="password" 
                name="confirm" 
                value={password.confirm} 
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => {
            setShowPasswordModal(false)
            resetPasswordForm()
          }}>
            Cancel
          </Button>
          <Button 
            color="blue" 
            onClick={handlePasswordSubmit}
            disabled={!password.current || !password.new || !password.confirm || loading}
          >
            Update Password
          </Button>
        </Modal.Actions>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        open={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        size="tiny"
      >
        <Modal.Header>Delete Your Account</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.</p>
          <p><strong>Please type "delete" to confirm:</strong></p>
          <Form.Input placeholder="Type 'delete' to confirm" />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setShowDeleteAccountModal(false)}>
            Cancel
          </Button>
          <Button color="red">
            <Icon name="trash" /> Delete Account
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  )
}

export default Settings 