import React, { useState } from 'react'
import Popup from './Popup'
import config from '../config'

export let updateApp = null

const start = Date.parse(config.startDate)
const end = Date.parse(config.endDate)
console.log((end - start) / config.step)

export default function App () {
  const [popup, setPopup] = useState(false)
  const [time, setTime] = useState(start)

  function openPopup () {
    setPopup(true)
  }

  function closePopup () {
    setPopup(false)
  }

  function getProgress () {
    return (time - start) / (end - start) * 100 + '%'
  }

  updateApp = function updateApp () {
    setTime(time + config.step)
  }

  return <main className='app'>
    <h1>COVID-19 Worldwide</h1>
    <button onClick={openPopup} className='button material-icons-round'>launch</button>
    <div className='bar'>
      <div className='bar-progress'
           style={{ width: getProgress() }}></div>
    </div>
    {popup
      ? <Popup onClose={closePopup} />
      : null}
  </main>
}
