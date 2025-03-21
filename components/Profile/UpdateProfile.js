import React, { useState, useRef } from 'react'
import { Form, Button, Message, Header, Grid, Image, Icon } from 'semantic-ui-react'
import ImageDropDiv from '../Common/ImageDropDiv'
import uploadPic from '../../utils/uploadPicToCloudinary'
import { profileUpdate } from '../../utils/profileActions'

function UpdateProfile({ Profile }) {
  const [profile, setProfile] = useState({ 
    profilePicUrl: Profile.user.profilePicUrl,
    name: Profile.user.name,
    email: Profile.user.email,
    username: Profile.user.username
  })

  const { name, email, username } = profile;
  const [errorMsg, setErrorMsg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [highlighted, setHighlighted] = useState(false)
  const inputRef = useRef()
  const [media, setMedia] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)

  const handleChange = e => {
    const { name, value, files } = e.target

    if(name === 'media') {
      setMedia(files[0])
      setMediaPreview(URL.createObjectURL(files[0]))
    }
    
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    let profilePicUrl;

    if(media !== null) {
      profilePicUrl = await uploadPic(media)
    }

    if(media !== null && !profilePicUrl) {
      setLoading(false)
      return setErrorMsg('Error Uploading Image')
    }
    
    // Username validation
    if(username.trim().length < 3) {
      setLoading(false)
      return setErrorMsg('Username must be at least 3 characters')
    }
    
    if(username.trim().length > 15) {
      setLoading(false)
      return setErrorMsg('Username must be less than 15 characters')
    }
    
    if(!/^[a-zA-Z0-9_]+$/.test(username)) {
      setLoading(false)
      return setErrorMsg('Username can only contain letters, numbers and underscores')
    }

    await profileUpdate(
      setLoading, 
      setErrorMsg, 
      profilePicUrl,
      setSuccess,
      name,
      username
    )
  }

  return (
    <div className="profile-content">
      <Header as="h1" className="update-profile-title">
        <Icon name="edit" />
        <Header.Content>Update Your Profile</Header.Content>
      </Header>
      
      <Form 
        className="update-profile-form"
        error={errorMsg !== null}
        success={success}
        loading={loading}
        onSubmit={handleSubmit}
      >
        <Message
          success
          icon="check circle"
          header="Success!"
          content="Your profile has been updated"
          onDismiss={() => setSuccess(false)}
        />
        
        <Message
          error
          icon="times circle"
          header='Oops!'
          content={errorMsg}
          onDismiss={() => setErrorMsg(null)}
        />

        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={6}>
              <div className="update-profile-picture-section">
                <Header as="h3" className="update-section-title">Profile Picture</Header>
                <div 
                  className="update-image-drop-container" 
                  style={{ background: highlighted ? 'rgba(99, 102, 241, 0.05)' : '' }}
                >
                  <ImageDropDiv
                    inputRef={inputRef}
                    highlighted={highlighted}
                    setHighlighted={setHighlighted}
                    handleChange={handleChange}
                    mediaPreview={mediaPreview}
                    setMediaPreview={setMediaPreview}
                    setMedia={setMedia}
                    profilePicUrl={profile.profilePicUrl}
                  />
                  <p className="update-image-drop-text">
                    <Icon name="cloud upload" />
                    Drag and drop or click to change your profile picture
                  </p>
                </div>
              </div>
            </Grid.Column>

            <Grid.Column width={10}>
              <div className="update-profile-details-section">
                <Header as="h3" className="update-section-title">Account Information</Header>
                
                <Form.Field className="update-form-field">
                  <label>Name</label>
                  <div className="input-with-icon">
                    <Icon name="user" className="input-icon" />
                    <input
                      className="update-input"
                      placeholder="Name"
                      name="name"
                      value={name || ''}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Field>

                <Form.Field className="update-form-field">
                  <label>Username</label>
                  <div className="input-with-icon">
                    <Icon name="at" className="input-icon" />
                    <input
                      className="update-input"
                      placeholder="Username (3-15 characters, letters, numbers, underscores)"
                      name="username"
                      value={username || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <small style={{ marginTop: "5px", display: "block", color: "#6b7280" }}>
                    Your username will appear in your profile URL and cannot be changed frequently.
                  </small>
                </Form.Field>

                <Form.Field disabled className="update-form-field">
                  <label>Email (Cannot be changed)</label>
                  <div className="input-with-icon">
                    <Icon name="envelope" className="input-icon" />
                    <input
                      className="update-input readonly"
                      placeholder="Email"
                      name="email"
                      value={email || ''}
                      readOnly
                    />
                  </div>
                </Form.Field>

                <div className="update-button-container">
                  <Button
                    className="update-profile-button"
                    icon="check"
                    labelPosition="left"
                    content="Save Changes"
                    type="submit"
                    disabled={loading || (!media && name === Profile.user.name && username === Profile.user.username)}
                  />
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    </div>
  )
}

export default UpdateProfile