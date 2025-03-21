import React from 'react'
import { Menu, Icon } from 'semantic-ui-react'

function ProfileMenuTabs({ activeItem, handleItemClick, ownAccount })
{
  return (
    <Menu pointing secondary className="profile-tabs">
      <Menu.Item
        name='profile'
        active={activeItem === 'profile'}
        onClick={() => handleItemClick('profile')}
      >
        <Icon name='user' />
        Profile
      </Menu.Item>

      {ownAccount && (
        <>
          <Menu.Item
            name='updateProfile'
            active={activeItem === 'updateProfile'}
            onClick={() => handleItemClick('updateProfile')}
          >
            <Icon name='edit' />
            Update Profile
          </Menu.Item>
          
          <Menu.Item
            name='settings'
            active={activeItem === 'settings'}
            onClick={() => handleItemClick('settings')}
          >
            <Icon name='settings' />
            Settings
          </Menu.Item>
        </>
      )}
    </Menu>
  )
}

export default ProfileMenuTabs