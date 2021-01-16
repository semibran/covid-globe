import React from 'react'
import type from 'prop-types'

Popup.propTypes = {
  onClose: type.func
}

export default function Popup (props) {
  return (
  <div className='popup'>
    <div id='popupTitle'>
      <img src='assets/round.png'/>
      <h2>STATISTICS + CONTROLS</h2>
      <button onClick={props.onClose} className='material-icons-round'>close</button>
    </div>
    <h3>COUNTRY STATISTICS</h3>
    popupmenu
    <div id='popupStats'></div>
    <h3 id='date'></h3>
    <div id='popupData'>
      <span id='cases'>Active Cases:</span>
      <span id='totalCases'>Total Cases to Date:</span>
      <span id='totalDeaths'>Total Deaths to Date:</span>
    </div>
    <h3>Controls</h3>
    <div id='controls'></div>
  </div>
  );
}
