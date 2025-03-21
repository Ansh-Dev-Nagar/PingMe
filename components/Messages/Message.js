import React, { useState } from 'react'
import { Icon, Popup } from 'semantic-ui-react'
import calculateTime from '../../utils/calculateTime'

function Message({ message, user, deleteMsg, bannerProfilePic, divRef }) {
  const [deleteIcon, showDeleteIcon] = useState(false)
  const ifYouSender = message.sender === user._id

  return (
    <div className={`message ${ifYouSender ? 'own' : ''}`} ref={divRef}>
      <img
        className="message-avatar"
        src={ifYouSender ? user.profilePicUrl : bannerProfilePic}
        alt="avatar"
      />
      <div className="message-bubble">
        <div className="message-content" onClick={() => ifYouSender && showDeleteIcon(!deleteIcon)}>
          {message.msg}
          {deleteIcon && ifYouSender && (
            <Popup
              trigger={
                <Icon
                  name="trash"
                  color="red"
                  style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '0.9em' }}
                  onClick={() => deleteMsg(message._id)}
                />
              }
              content="This will only delete the message from your inbox!"
              position="top right"
            />
          )}
          <div className="message-time">{calculateTime(message.date)}</div>
        </div>
      </div>
    </div>
  )
}

export default Message