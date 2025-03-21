import React from 'react'
import { Form, Segment, Image, Icon, Header, Message } from 'semantic-ui-react'
import { useRouter } from 'next/router'


function ImageDropDiv({highlighted, setHighlighted, inputRef, handleChange, mediaPreview, setMediaPreview, setMedia, profilePicUrl, setErrorMsg })
{
  const router = useRouter()

  const signupRoute = router.pathname === '/signup'
  
  const validateFile = (file) => {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg && setErrorMsg('Image too large. Maximum size is 5MB.')
      return false
    }
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
    if (!validTypes.includes(file.type)) {
      setErrorMsg && setErrorMsg('Invalid file type. Please upload a JPEG, PNG, or GIF image.')
      return false
    }
    
    return true
  }

  const checkForSignupPage = () =>
    signupRoute ? (
      <>
        <Header icon>
          <Icon
            name='file image outline'
            style={{ cursor: 'pointer' }}
            onClick={() => inputRef.current.click()}
            size='huge'
          />
          Drag n Drop or Click to upload image
        </Header>
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
          Supported formats: JPEG, PNG, GIF | Max size: 5MB
        </p>
      </>
    ) : (
      <span style={{ textAlign: 'center' }}>
        <Image
          src={profilePicUrl}
          alt='Profile pic'
          style={{ cursor: 'pointer' }}
          onClick={() => inputRef.current.click()}
          size='medium'
          centered
        />
        Drag n Drop or Click to upload image
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
          Supported formats: JPEG, PNG, GIF | Max size: 5MB
        </p>
      </span>
    )


  return (
    <>
      <Form.Field>
        <Segment placeholder basic secondary>
          <input
            style={{ display: 'none' }}
            type='file'
            accept='image/*'
            onChange={handleChange}
            name='media'
            ref={inputRef}
          />

          <div
            onDragOver={e =>
                        {
                          e.preventDefault()
                          setHighlighted(true)
                        }}
            onDragLeave={e =>
                         {
                           e.preventDefault()
                           setHighlighted(false)
                         }}
            onDrop={e =>
                    {
                      e.preventDefault()
                      setHighlighted(true)

                      const droppedFile = Array.from(e.dataTransfer.files)[0]
                      
                      if (validateFile(droppedFile)) {
                        setMedia(droppedFile)
                        setMediaPreview(URL.createObjectURL(droppedFile))
                        setErrorMsg && setErrorMsg(null)
                      }
                    }}
          >
            {mediaPreview === null ? (
              <>
                <Segment color={highlighted ? 'green' : 'grey'} placeholder basic>
                  {checkForSignupPage()}
                </Segment>
              </>
            ) : (
              <Segment color='green' placeholder basic>
                <Image
                  src={mediaPreview}
                  size='medium'
                  centered
                  style={{ cursor: 'pointer' }}
                  onClick={() => inputRef.current.click()}
                />
              </Segment>
            )}
          </div>
        </Segment>
      </Form.Field>
    </>
  )
}

export default ImageDropDiv