import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import baseUrl from '../utils/baseUrl'
import { parseCookies } from 'nookies'
import { Grid, Header, Icon } from 'semantic-ui-react'
import { NoProfile } from '../components/Layout/NoData'
import ProfileMenuTabs from '../components/Profile/ProfileMenuTabs'
import ProfileHeader from '../components/Profile/ProfileHeader'
import UpdateProfile from '../components/Profile/UpdateProfile'
import Settings from '../components/Profile/Settings'
import Spinner from '../components/Layout/Spinner'

function ProfilePage({ errorLoading, profile, user })
{
  const router = useRouter()
  const [loading, setLoading] = useState(!user)
  const [showToastr, setShowToastr] = useState(false)
  const [activeItem, setActiveItem] = useState('profile')

  const handleItemClick = clickedTab => setActiveItem(clickedTab)

  useEffect(() =>
  {
    if (router.query.tab) {
      setActiveItem(router.query.tab);
    }
  }, [router.query.tab]);

  useEffect(() =>
  {
    showToastr && setTimeout(() => setShowToastr(false), 4000)
  }, [showToastr])

  if (errorLoading) return <NoProfile />
  if (!profile || !user) return <Spinner />

  const ownAccount = profile.user._id === user._id

  return (
    <>
      <div className="profile-container">
        <div className="profile-tabs-container">
          <ProfileMenuTabs activeItem={activeItem} handleItemClick={handleItemClick} ownAccount={ownAccount} />
        </div>

        <div className="profile-content-container">
          {activeItem === 'profile' && (
            <>
              <Header as="h1" className="update-profile-title">
                <Icon name="user" />
                <Header.Content>Profile</Header.Content>
              </Header>
              <ProfileHeader profile={profile} />
            </>
          )}

          {activeItem === 'updateProfile' && <UpdateProfile Profile={profile} />}
          
          {activeItem === 'settings' && ownAccount && <Settings user={user} />}
        </div>
      </div>
    </>
  )
}

ProfilePage.getInitialProps = async ctx =>
{
  try
  {
    const { username } = ctx.query
    const { token } = parseCookies(ctx)

    // Fetch both profile and user data in parallel
    const [profileRes, userRes] = await Promise.all([
      axios.get(`${baseUrl}/api/profile/${username}`, {
        headers: { Authorization: token }
      }),
      axios.get(`${baseUrl}/api/auth`, {
        headers: { Authorization: token }
      })
    ])

    const { profile } = profileRes.data
    const { user } = userRes.data

    return { profile, user }
  }
  catch (error)
  {
    return { errorLoading: true }
  }
}

export default ProfilePage