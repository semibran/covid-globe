import React, { useState, useEffect } from 'react'
import Popup from './Popup'
import config from '../config'

const start = Date.parse(config.startDate)
const end = Date.parse(config.endDate)

export default function App () {
  const [popup, setPopup] = useState(false)
  const [time, setTime] = useState(start)
  let ms = start

  function openPopup () {
    setPopup(true)
  }

  function closePopup () {
    setPopup(false)
  }

  function getProgress () {
    return (time - start) / (end - start) * 100 + '%'
  }

  useEffect(_ => {
    setInterval(function update () {
      ms += config.step
      if (ms >= end) {
        ms = start
      }
      setTime(ms)
    }, config.interval)
  }, [])

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
