import React from 'react'
import HeadTags from './HeadTags'
import Navbar from './Navbar'
import { Container } from 'semantic-ui-react'
import nprogress from 'nprogress'
import Router, { useRouter } from 'next/router'
import SideMenu from './SideMenu'
import MobileHeader from './MobileHeader'
import { createMedia } from '@artsy/fresnel'

const AppMedia = createMedia({
  breakpoints: { zero: 0, mobile: 549, tablet: 850, computer: 1080 }
})

const mediaStyles = AppMedia.createMediaStyle()
const { Media, MediaContextProvider } = AppMedia

function Layout({ children, user }) {
  const router = useRouter()
  const isAuthPage = router.pathname === '/login' || router.pathname === '/signup'

  Router.onRouteChangeStart = () => nprogress.start()
  Router.onRouteChangeComplete = () => nprogress.done()
  Router.onRouteChangeError = () => nprogress.done()

  return (
    <>
      <HeadTags />
      {user ? (
        <>
          <style>{mediaStyles}</style>

          <MediaContextProvider>
            <Media greaterThan="mobile">
              <SideMenu user={user} pc />
              <div className="main-content">
                {children}
              </div>
            </Media>

            <Media at="mobile">
              <MobileHeader user={user} />
              {children}
            </Media>
          </MediaContextProvider>
        </>
      ) : (
        <>
          {!isAuthPage && <Navbar />}
          {isAuthPage ? (
            <>{children}</>
          ) : (
            <Container text style={{ paddingTop: '1rem' }}>
              {children}
            </Container>
          )}
        </>
      )}
    </>
  )
}

export default Layout