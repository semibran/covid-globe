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
  time: type.number,
  exit: type.bool,
  onExit: type.func,
  onChange: type.func,
  onClose: type.func
}

export default function Popup (props) {
  const [maxCases, setMaxCases] = useState(0)
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
    const rect = canvas.parentNode.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
  }, [props.data])

  useEffect(_ => {
    if (!props.data) return
    const canvas = canvasRef.current
    const date = new Date(props.time).toISOString().slice(0, 10)
    const node = props.data.find(node => node.date === date)
    if (node) {
      setCases(parseInt(node.total_cases || 0))
      setVaccs(parseInt(node.total_vaccinations || 0))
      setDeaths(parseInt(node.total_deaths || 0))
      plotData(canvas, props.data.slice(0, props.data.indexOf(node)))
    }
  }, [props.time])

  function plotData (canvas, data) {
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.beginPath()

    let maxCases = 0
    for (const point of data) {
      const cases = parseInt(point.total_cases)
      if (cases > maxCases) {
        maxCases = cases
      }
    }
    setMaxCases(maxCases)

    for (let i = 0; i < data.length; i++) {
      const node = data[i]
      const x = i / data.length * canvas.width
      const y = maxCases
        ? (1 - parseInt(node.total_cases || 0) / maxCases) * canvas.height
        : canvas.height
      if (!i) {
        context.moveTo(x, y)
      } else if (i === data.length - 1) {
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
    context.closePath()
  }

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
      <h3 className='popup-heading'>Total Cases</h3>
      <div className='popup-graph-wrap'>
        <div className='popup-graph-vaxis'>
          <span className='popup-graph-label'>{fmtnum(maxCases)}</span>
          <span className='popup-graph-label'>{fmtnum(Math.round(maxCases / 3 * 2))}</span>
          <span className='popup-graph-label'>{fmtnum(Math.round(maxCases / 3))}</span>
          <span className='popup-graph-label'>0</span>
        </div>
        <div className='popup-graph'>
          <canvas ref={canvasRef} width='0'></canvas>
        </div>
        <div></div>
        <div className='popup-graph-haxis'>
          <span className='popup-graph-label'>{props.data && new Date(Date.parse(props.data[0].date)).toGMTString().slice(5, 11)}</span>
          <span className='popup-graph-label'>July 11</span>
          <span className='popup-graph-label'>Sep 08</span>
        </div>
      </div>
    </section>
    <section className='popup-section -values'>
      <h3 className='popup-heading'>Stats</h3>
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
