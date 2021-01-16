import React from 'react'
import type from 'prop-types'

Popup.propTypes = {
  onClose: type.func
}

export default function Popup (props) {
  return (
  <div className='popup'>
    <img src='assets/round.png'/>
    <h2>STATISTICS + CONTROLS</h2>
    <span onClick={props.onClose} className='material-icons-round'>close</span>
  </div>
  );
}
