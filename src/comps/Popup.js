import React, { useState, useRef, useEffect } from 'react'
import type from 'prop-types'
import countries from '../data/countries'
import config from '../config'

const worldwide = {
  id: 'WWW',
  name: 'Worldwide'
}

let select = null

Popup.propTypes = {
  select: type.string,
  data: type.array,
  exit: type.bool,
  onExit: type.func,
  onChange: type.func,
  onClose: type.func
}

export default function Popup (props) {
  const [max, setMax] = useState(0)
  const canvasRef = useRef(null)
  if (props.select && props.select !== select) {
    select = props.select
  }

  useEffect(_ => {
    if (!props.data) return
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const rect = canvas.parentNode.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    let max = 0
    for (const point of props.data) {
      const cases = parseInt(point.total_cases)
      if (cases > max) {
        max = cases
      }
    }
    setMax(max)

    for (let i = 0; i < props.data.length; i++) {
      const point = props.data[i]
      const x = i / props.data.length * canvas.width
      const y = (1 - parseInt(point.total_cases) / max) * canvas.height
      if (!i) {
        context.moveTo(x, y)
      } else {
        context.lineTo(x, y)
      }
    }
    context.strokeStyle = '#2596FF'
    context.stroke()
  }, [props.data])

  return <div className={props.exit ? 'popup -exit' : 'popup'} onAnimationEnd={_ => props.exit && props.onExit()}>
    <span onClick={props.onClose} className='popup-close material-icons-round'>close</span>
    <section className='popup-section -select'>
      <h3 className='popup-heading'>Country Statistics</h3>
      <select className='popup-select' value={select || 'WWW'} onChange={props.onChange}>
        {[worldwide, ...countries].map((country, i) =>
          <option key={i} value={country.id} className='popup-option'>{country.name}</option>
        )}
      </select>
    </section>
    <section className='popup-section -graph'>
      <h3 className='popup-heading'>Daily Change (Cases)</h3>
      <div className='popup-graph-wrap'>
        <div className='popup-graph-vaxis'>
          <span className='popup-graph-label'>{max}</span>
          <span className='popup-graph-label'>{Math.round(max / 3 * 2)}</span>
          <span className='popup-graph-label'>{Math.round(max / 3)}</span>
          <span className='popup-graph-label'>0</span>
        </div>
        <div className='popup-graph'>
          <canvas ref={canvasRef} width='0'></canvas>
        </div>
        <div></div>
        <div className='popup-graph-haxis'>
          <span className='popup-graph-label'>May 29</span>
          <span className='popup-graph-label'>July 11</span>
          <span className='popup-graph-label'>Sep 08</span>
        </div>
      </div>
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
          <span className='popup-value'>{10}</span>
        </div>
        <div className='popup-entry -deaths-ytd'>
          <span className='popup-prop'>Deaths to date</span>
          <span className='popup-value'>10,100</span>
        </div>
      </div>
    </section>
  </div>
}
