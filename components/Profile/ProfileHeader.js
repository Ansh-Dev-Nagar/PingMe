import React from 'react'
import { Segment, Image, Header, Icon } from 'semantic-ui-react'

function ProfileHeader({ profile }) {
  return (
    <Segment className="profile-header">
      <div className="profile-avatar-container">
        <Image className="profile-avatar" src={profile.user.profilePicUrl} alt={profile.user.name} />
      </div>
      <div className="profile-details">
        <Header as='h2' className="profile-name" content={profile.user.name} />
        <div className="profile-username">@{profile.user.username}</div>
        
        <div className="profile-bio">
          <p>Welcome to my PingMe profile! Connect with me and let's chat.</p>
        </div>
        
        <div className="profile-stats">
          <div className="profile-stat-item">
            <Icon name="calendar alternate outline" />
            <span>Joined {new Date(profile.user.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="profile-stat-item">
            <Icon name="envelope outline" />
            <span>{profile.user.email}</span>
          </div>
        </div>
      </div>
    </Segment>
  )
}

export default ProfileHeader