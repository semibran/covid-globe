import React, { useState, useRef, useEffect } from 'react'
import type from 'prop-types'
import countries from '../data/countries'

const worldwide = {
  id: 'WWW',
  name: 'Worldwide'
}

let select = null

function fmtnum (num) {
  if (num > 1000000) {
    return Math.round(num / 100000) / 10 + 'M'
  } else {
    return num.toLocaleString()
  }
}

Popup.propTypes = {
  select: type.string,
  data: type.array,
  exit: type.bool,
  onExit: type.func,
  onChange: type.func,
  onClose: type.func
}

export default function Popup (props) {
  const [cases, setCases] = useState(0)
  const [vaccs, setVaccs] = useState(0)
  const [deaths, setDeaths] = useState(0)
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

    console.log(props.data)

    let maxCases = 0
    let maxVaccs = 0
    let maxDeaths = 0
    for (const point of props.data) {
      const cases = parseInt(point.total_cases)
      const vaccs = parseInt(point.total_vaccinations)
      const deaths = parseInt(point.total_deaths)
      if (cases > maxCases) {
        maxCases = cases
      }
      if (vaccs > maxVaccs) {
        maxVaccs = vaccs
      }
      if (deaths > maxDeaths) {
        maxDeaths = deaths
      }
    }
    setCases(maxCases)
    setVaccs(maxVaccs)
    setDeaths(maxDeaths)

    for (let i = 0; i < props.data.length; i++) {
      const point = props.data[i]
      const x = i / props.data.length * canvas.width
      const y = (1 - parseInt(point.total_cases) / maxCases) * canvas.height
      if (!i) {
        context.moveTo(x, y)
      } else if (i === props.data.length - 1) {
        context.lineTo(x, y)
        context.lineTo(x + 2, y)
      } else {
        context.lineTo(x, y)
      }
    }
    context.lineTo(canvas.width + 2, canvas.height + 2)
    context.lineTo(0, canvas.height + 2)
    context.strokeStyle = '#2596FF'
    context.stroke()
    context.fillStyle = '#2596FF'
    context.globalAlpha = 0.5
    context.fill()
    context.globalAlpha = 1
  }, [props.data])

  function onEnd () {
    if (props.exit) {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      context.clearRect(0, 0, canvas.width, canvas.height)
      props.onExit()
    }
  }

  return <div className={props.exit ? 'popup -exit' : 'popup'} onAnimationEnd={onEnd}>
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
          <span className='popup-graph-label'>{fmtnum(cases)}</span>
          <span className='popup-graph-label'>{fmtnum(Math.round(cases / 3 * 2))}</span>
          <span className='popup-graph-label'>{fmtnum(Math.round(cases / 3))}</span>
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
          <span className='popup-prop'>Total cases</span>
          <span className='popup-value'>{cases.toLocaleString()}</span>
        </div>
        <div className='popup-entry -deaths'>
          <span className='popup-prop'>Total deaths</span>
          <span className='popup-value'>{deaths.toLocaleString()}</span>
        </div>
        <div className='popup-entry -recovered'>
          <span className='popup-prop'>Recovered</span>
          <span className='popup-value'>{0}</span>
        </div>
        <div className='popup-entry -vaccinations'>
          <span className='popup-prop'>Vaccinations</span>
          <span className='popup-value'>{vaccs.toLocaleString()}</span>
        </div>
      </div>
    </section>
  </div>
}
