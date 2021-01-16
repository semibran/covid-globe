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
    <div id='dropdown'>
      <select>
        <option value='0'>Worldwide</option>
        <option value='1'>Worldwider</option>
        <option value='2'>Worldwidest</option>
      </select>
    </div>
    <div id='popupStats'></div>
    <h3 id='date'></h3>
    <div id='popupData'>
      <div id='cases'>Active Cases:</div>
      <div id='totalCases'>Total Cases to Date:</div>
      <div id='totalDeaths'>Total Deaths to Date:</div>
    </div>
    <h3>Controls</h3>
    <div id='controls'></div>
  </div>
  );
}
