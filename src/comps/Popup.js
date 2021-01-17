import React from 'react'
import type from 'prop-types'
import countries from '../data/countries'

const worldwide = {
  id: 'WWW',
  name: 'Worldwide'
}

Popup.propTypes = {
  select: type.string,
  onChange: type.func,
  onClose: type.func
}

export default function Popup (props, ref) {
  return <div className='popup'>
    <span onClick={props.onClose} className='popup-close material-icons-round'>close</span>
    <section className='popup-section -select'>
      <h3 className='popup-heading'>Country Statistics</h3>
      <select className='popup-select' value={props.select || 'WWW'} onChange={props.onChange}>
        {[worldwide, ...countries].map((country, i) =>
          <option key={i} value={country.id} className='popup-option'>{country.name}</option>
        )}
      </select>
    </section>
    <section className='popup-section -values'>
      <h3 className='popup-heading'>July 12-19, 2020</h3>
      <div className='popup-entries'>
        <div className='popup-entry -cases'>
          <span className='popup-prop'>Active cases</span>
          <span className='popup-value'>10,100</span>
        </div>
        <div className='popup-entry -recovers'>
          <span className='popup-prop'>Recovered</span>
          <span className='popup-value'>10,100</span>
        </div>
        <div className='popup-entry -cases-ytd'>
          <span className='popup-prop'>Cases to date</span>
          <span className='popup-value'>10,100</span>
        </div>
        <div className='popup-entry -deaths-ytd'>
          <span className='popup-prop'>Deaths to date</span>
          <span className='popup-value'>10,100</span>
        </div>
      </div>
    </section>
  </div>
}
