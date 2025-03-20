import { Icon, Message, Divider, Grid } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export const FooterMessage = () =>
{
  const router = useRouter()
  const signupRoute = router.pathname === '/signup'

  return (
    <>
      {signupRoute ? (
        <>
          <Message attached='bottom' warning>
            <Icon name='help' />
            Existing User? <Link href='/login'>Login Here Instead</Link>
          </Message>
          <Divider hidden />
        </>
      ) : (
        <>
          <Divider hidden />

          <Message attached='bottom' warning>
            <Icon name='help' />
            New User? <Link href='/signup'>Signup Here</Link> Instead{' '}
          </Message>
        </>
      )}
    </>
  )
}

export const Footer = () =>
{
    return (
        <footer>
            <div style={{ width: '100%', textAlign: 'center', fontSize: '18px' }}>
              <strong>Built by Ansh Dev Nagar (2024)</strong>
            </div>
            
            <br />
            
            <div style={{ width: '100%', textAlign: 'center', fontSize: '18px' }}>
              <strong>Email - anshdevnagar@gmail.com</strong>        
            </div>
            <br />
        </footer>
    )
}