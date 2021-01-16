import React from 'react'
import type from 'prop-types'

Popup.propTypes = {
  onClose: type.func
}

export default function Popup (props) {
  return <div className='popup'>
    <p>Hello, I&apos;m a popup!</p>
    <span onClick={props.onClose} className='material-icons-round'>close</span>
  </div>
}
