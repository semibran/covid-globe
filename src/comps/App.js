import React, { useState } from 'react'
import Popup from './Popup'

export default function App () {
  const [popup, setPopup] = useState(false)

  function openPopup () {
    setPopup(true)
  }

  function closePopup () {
    setPopup(false)
  }

  return <main className='app'>
    <h1>COVID-19 Worldwide</h1>
    <button onClick={openPopup} className='button material-icons-round'>launch</button>
    {popup
      ? <Popup onClose={closePopup} />
      : null}
  </main>
}
